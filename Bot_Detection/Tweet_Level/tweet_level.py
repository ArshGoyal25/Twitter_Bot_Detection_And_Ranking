# pyright: reportMissingImports=false, reportUntypedBaseClass=error
import json
from typing import Collection
import pandas as pd
from keras.preprocessing import text, sequence
from keras.preprocessing.sequence import pad_sequences
from pandas.core.algorithms import mode
import numpy as np
import pickle
import keras
from keras import models
from keras.layers import Dense, Input, LSTM, Embedding, Dropout, Activation
from keras.layers import Bidirectional, GlobalMaxPool1D
from keras.models import Model
from keras import initializers, regularizers, constraints, optimizers, layers
from keras_preprocessing.text import tokenizer_from_json
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
import warnings
warnings.filterwarnings("ignore") 
import os
dirname = os.path.dirname(__file__)
import logging
from collections import defaultdict

class Tweet_Model:
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/Tweet_Model/')
        self.filename = os.path.join(self.common_path, 'tweet_model.h5')
        self.tokenizer = os.path.join(self.common_path, 'tokenizer_tweet.json')
        self.embedding_matrix_file = os.path.join(self.common_path, 'embedding_matrix.pkl')
        self.tweet_list = []
        self.tweet_list.append(["Tweet", "Classification", "Estimate"])
        self.tweet_summary = defaultdict(float)
        self.reverse = False

    def tweet(self, text, tweet_model,tokenizer):
        tweet= [text]
        tweet_seq = tokenizer.texts_to_sequences(tweet)
        tweet_pad = sequence.pad_sequences(tweet_seq, maxlen=250)
        y_prob = tweet_model.predict([tweet_pad],batch_size=1)
        y_prob.argmax(axis=-1)
        result = y_prob[0]
        result = result.tolist()
        place = result.index(max(result))
        max_value = round(result[place],3)
        if self.reverse:
            if place == 0:
                result = [text, "Bot",max_value]
                self.tweet_list.append(result)
                self.tweet_summary["Total_Bots"] += 1
                return 0
            else:
                result = [text, "Genuine",max_value]
                self.tweet_list.append(result)
                self.tweet_summary["Total_Genuine"] += 1
                return 1
        else:
            if place == 0:
                result = [text, "Genuine",max_value]
                self.tweet_list.append(result)
                self.tweet_summary["Total_Genuine"] += 1
                return 0
            else:
                result = [text, "Bot",max_value]
                self.tweet_list.append(result)
                self.tweet_summary["Total_Bots"] += 1
                return 1

    def create_model(self):
        inputs = Input(shape=(250, ))
        x = Embedding(20000, 128)(inputs)
        x = Bidirectional(LSTM(50))(x)
        x = Dropout(0.1)(x)
        x = Dense(50, activation="relu")(x)
        x = Dropout(0.1)(x)
        outputs = Dense(6, activation="sigmoid")(x)
        model = Model(inputs=inputs, outputs=outputs)
        return model
            
    def classify_as_bot_or_not(self,model_attributes, dna_result, account_result):
        logging.info("Running Tweet Level Model")

        if dna_result == 0.0:
            if account_result < 0.9:
                self.reverse = True

        model = self.create_model()
        model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
        model.load_weights(self.filename)

        print(model.summary())
        logging.info("The tweet level model has been trained")
        with open(self.tokenizer) as f:
            data = json.load(f)
            tokenizer= tokenizer_from_json(data)
        
        self.tweet_summary["Total_Tweets_Present"] = len(model_attributes)
        for i in model_attributes:
            prediction = self.tweet(i,model,tokenizer)
            self.tweet_summary['Total_Tweets_Analysed'] += 1
        try:
            self.tweet_summary['Final_Prediction'] = round (self.tweet_summary['Total_Bots'] / self.tweet_summary['Total_Tweets_Analysed'], 3) 
        except:
            self.tweet_summary['Final_Prediction'] = 0
        print("##################################################################################")
        print("Tweet Level Model: The changes the account ",self.username," is a bot account is :", self.tweet_summary['Final_Prediction'])
        print("##################################################################################")
        print()
        logging.info("The Prediction has been made")
        logging.info("End of Tweet Model")
        return self.tweet_summary, self. tweet_list