# pyright: reportMissingImports=false, reportUnusedVariable=warning, reportUntypedBaseClass=error
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

class Hate_Speech_Model():
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/Hate_Speech/')
        self.model = os.path.join(self.common_path, 'hate_model.h5')
        self.tokenizer = os.path.join(self.common_path, 'tokenizer_hate.json')
        self.maxlen = 150
        self.labels = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
        self.hate_summary = defaultdict(int)
        self.tweets_with_hate = list()
        self.tweets_with_hate.append(['tweet', 'toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate'])

    def preprocess_pred(self, tweet_list):
        with open (self.tokenizer) as file:
            data = json.load(file)
            tokenizer_json = tokenizer_from_json(data)
        test_strings=np.asarray(tweet_list)
        test_strings=tokenizer_json.texts_to_sequences(test_strings)
        test_strings=sequence.pad_sequences(test_strings, maxlen=self.maxlen)
        model = load_model(self.model)
        return model.predict(test_strings)

    def rank_account(self,model_attributes):
        logging.info("Running Hate Speech Detection")
        result = self.preprocess_pred(model_attributes)
        logging.info("The hate speech model has been trained")
        self.hate_summary["Total_Tweets_Analysed"] = len(model_attributes)

        for i in range(len(result)):
            res = result[i].tolist()
            hate_values = []
            hate_dict = dict()
            hate_values.append(model_attributes[i])
            for j in range(len(res)):
                hate_dict[self.labels[j]] = round(res[j],3)
                hate_values.append(round(res[j],3))
            hate_dict = dict(sorted(hate_dict.items(), key=lambda x: x[1],reverse=True))
            count = reduce(lambda sum, j: sum  + (1 if j > 0.1 else 0), hate_dict.values() , 0)
            if(count <= 1):
                self.hate_summary['Tweets_without_hate'] +=1
            else:
                keys = list(hate_dict.keys())
                self.hate_summary['Tweets_with_hate'] += 1
                self.hate_summary[keys[0]] += 1
                self.tweets_with_hate.append(hate_values)
        self.hate_summary['Percentage_tweets_with_hate'] = round(self.hate_summary['Tweets_with_hate']/ self.hate_summary["Total_Tweets_Analysed"],2)
        print(self.hate_summary)
        print(self.tweets_with_hate)
        print("##################################################################################")
        print("Hate Speech Detection: The account ",self.username," has ", self.hate_summary['Percentage_tweets_with_hate'] ,"% of tweets with hate content")
        print("##################################################################################")
        print()
        logging.info("The Prediction has been made")
        logging.info("End of Hate Speech Detection")

        return self.hate_summary, self.tweets_with_hate

