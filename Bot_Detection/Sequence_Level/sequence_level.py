import pandas as pd
from pandas.core.algorithms import mode
import numpy as np
import pickle
import sys
import zlib
import logging
import warnings
warnings.filterwarnings("ignore") 
import os
dirname = os.path.dirname(__file__)

class Sequence_Model:
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/Sequence_Level/')
        self.filename = os.path.join(self.common_path, 'sequence_model.pkl')
        self.dna_summary = dict()

    def create_dna_from_tweets(self,tweets_df):
        # For each user id in tweets_df return a digital DNA string based on posting behaviour.
        # Add columns for counts of tweets, replies and retweets.
        tweets_df['num_retweets'] = np.where(tweets_df['retweeted_status_id'] == 0, 0, 1)
        tweets_df['num_replies'] = np.where(tweets_df['in_reply_to_status_id'] == 0, 0, 1)
        tweets_df['num_tweets'] = np.where((tweets_df['num_retweets'] == 0) & (tweets_df['num_replies'] == 0), 1, 0)

        # DNA alphabet for tweet (A), retweet (C) and reply (T).
        tweets = tweets_df['num_tweets'] == 1
        retweets = tweets_df['num_retweets'] == 1
        replies = tweets_df['num_replies'] == 1
        tweets_df.loc[:, 'DNA'] = np.where(retweets, 'C', np.where(replies, 'T', 'A'))

        #Storing Number of Tweets, replies and retweets in dict
        self.dna_summary['num_tweets'] = int(tweets_df[tweets_df['num_tweets'] == 1]['tweet_id'].count())
        self.dna_summary['num_replies'] = int(tweets_df[tweets_df['num_replies'] == 1]['tweet_id'].count())
        self.dna_summary['num_retweets'] = int(tweets_df[tweets_df['num_retweets'] == 1]['tweet_id'].count())

        # Sort tweets by timestamp.
        tweets_df = tweets_df[['user_id', 'timestamp', 'DNA']]
        tweets_df = tweets_df.sort_values(by=['timestamp'])

        # Create digital DNA string for account.
        dna = tweets_df.groupby(by=['user_id'])['DNA'].agg(lambda x: ''.join(x))
        return dna

    def compress_dna_df(self,dna):
        # Return a dataframe with compression facts for a series of dna.

        # Convert DNA in string object to bytes object.
        dna_bytes = dna.apply(lambda s: s.encode('utf-8'))

        # Run compression on each DNA string in the sample.
        dna_compressed = dna_bytes.apply(lambda b: zlib.compress(b))

        # Create dataframe with compression facts.
        dna_df = pd.DataFrame({'dna': dna,
                            'original_dna_size': dna_bytes.apply(sys.getsizeof), 
                            'compressed_dna_size': dna_compressed.apply(sys.getsizeof)})
        
        dna_df['compression_ratio'] = dna_df['original_dna_size'] / dna_df['compressed_dna_size']
        
        return dna_df

    def classify_as_bot_or_not(self,model_attributes):
        logging.info("Running DNA Compression")
        model_df = pd.DataFrame(model_attributes)
        self.dna_summary["total_tweets"] = len(model_df["tweet_id"])

        if self.dna_summary["total_tweets"] == 0:   
            self.dna_summary['DNA'] = ''
            self.dna_summary['num_tweets'] = 0
            self.dna_summary['num_replies'] = 0
            self.dna_summary['num_retweets'] = 0
            self.dna_summary['original_dna_size'] = 0
            self.dna_summary['compressed_dna_size'] = 0  
            self.dna_summary['compression_ratio'] = 0
            self.dna_summary['Final_Prediction'] = 0
            return self.dna_summary


        DNA_seq = self.create_dna_from_tweets(model_df)
        logging.info("The DNA Sequence has been obtained")
        DNA_seq = self.compress_dna_df(DNA_seq)
        logging.info("The Compression Ratio has been Calculated")

        self.dna_summary['DNA'] = DNA_seq['dna'][0]
        self.dna_summary['original_dna_size'] = int(DNA_seq['original_dna_size'][0])
        self.dna_summary['compressed_dna_size'] = int(DNA_seq['compressed_dna_size'][0])
        self.dna_summary['compression_ratio'] = float(DNA_seq['compression_ratio'][0])

        loaded_model = pickle.load(open(self.filename, 'rb'))
        x = DNA_seq[['original_dna_size', 'compressed_dna_size']]
        prediction = loaded_model.predict(x)
        self.dna_summary['Final_Prediction'] = float(1 - prediction[0])
        print("##################################################################################")
        if self.dna_summary['Final_Prediction'] == 0:
            print("The account ",self.username," is a genuine account as per Sequence Model")
        else:
            print("The account ",self.username," is a bot account as per Seqeunce Model")
        print("##################################################################################")
        print()
        print(self.dna_summary)

        logging.info("The Prediction has been made")
        logging.info("End of DNA Compression")
        return self.dna_summary


