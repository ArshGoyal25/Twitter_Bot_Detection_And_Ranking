# pyright: reportMissingImports=false, reportUntypedBaseClass=error
import pandas as pd
from keras.preprocessing import sequence
from keras.models import load_model
from keras_preprocessing.text import tokenizer_from_json
from pandas.core.algorithms import mode, value_counts
import numpy as np
import pickle
from collections import defaultdict
import keras
from keras_preprocessing.text import tokenizer_from_json
from keras.preprocessing.sequence import pad_sequences
import warnings
from functools import reduce
warnings.filterwarnings("ignore") 
import os
dirname = os.path.dirname(__file__)
import logging
import json
import string
from nltk.corpus import stopwords
import nltk
# nltk.download('stopwords')

def remove_punctuation_and_stopwords(sms):
    sms_no_punctuation = [ch for ch in sms if ch not in string.punctuation]
    sms_no_punctuation = "".join(sms_no_punctuation).split()
    sms_no_punctuation_no_stopwords = [word.lower() for word in sms_no_punctuation if word.lower() not in stopwords.words("english")]
    return sms_no_punctuation_no_stopwords

class Spam_Model():
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/Spam_Detection/')
        self.filename = os.path.join(self.common_path, 'spam_model.pkl')
        self.spam_summary = defaultdict(int)
        self.tweets_with_spam = list()
        self.tweets_with_spam.append(['Tweet', 'Estimate'])

    def rank_account(self, model_attributes):
        logging.info("Running Spam Detection")
        with open(self.filename, mode='rb') as file:
            model=pickle.load(file)
        df = pd.DataFrame(model_attributes, columns = ["Tweets"])
        df['Tweets'].apply(remove_punctuation_and_stopwords)    
        logging.info("The spam model has been trained")    
        result = model.predict(df["Tweets"])
        self.spam_summary["Total_Tweets_Analysed"] = len(model_attributes)

        for i in range(len(result)):
            if result[i] == "spam":
                print(model_attributes[i])
                self.tweets_with_spam.append([model_attributes[i],0.8])
                self.spam_summary["Tweets_containing_spam"] += 1

        self.spam_summary['Percentage_tweets_with_spam'] = round(self.spam_summary["Tweets_containing_spam"] / self.spam_summary["Total_Tweets_Analysed"] ,2)
        print("##################################################################################")
        print("Hate Speech Detection: The account ",self.username," has ", self.spam_summary['Percentage_tweets_with_spam'],"% of tweets with spam content")
        print("##################################################################################")
        print()
        logging.info("The Prediction has been made")
        logging.info("End of Hate Speech Detection")
        print(self.spam_summary)
        print(self.tweets_with_spam)

        return self.spam_summary, self.tweets_with_spam

