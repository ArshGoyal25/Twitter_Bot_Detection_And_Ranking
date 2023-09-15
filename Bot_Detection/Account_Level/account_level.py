# pyright: reportMissingImports=false, reportUnusedVariable=warning, reportUntypedBaseClass=error
from sys import setdlopenflags
import pandas as pd
from pandas.core.algorithms import mode
import numpy as np
from keras import models
import csv
from keras.regularizers import l2
from keras.layers import Embedding, Dense, LSTM, Dense, Input, concatenate
from keras.models import Model
import warnings
import tensorflow as tf
warnings.filterwarnings("ignore") 
import os
dirname = os.path.dirname(__file__)
import logging


class Account_Model:
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/Account_Level/')
        self.model = os.path.join(self.common_path, 'account_level.h5')
        self.mean_csv = os.path.join(self.common_path, 'mean_dict.csv')
        self.std_csv = os.path.join(self.common_path, 'std_dict.csv')
        self.account_summary = dict()

    def clean_df(self,df):
        df['created_at'] = pd.to_datetime(df['created_at'],utc=True)
        df['updated'] = pd.to_datetime(df['updated'],utc=True)
        df['age'] = (df['updated'] - df['created_at']).astype('timedelta64[D]').astype(int)
        df['has_location'] = df['location'].apply(lambda x: 0 if x==x else 1)
        df['has_avatar'] = df['default_profile_image'].apply(lambda x: 1 if x==x else 0)
        df['has_background'] = df['profile_use_background_image'].apply(lambda x: 1 if x==x else 0)
        df['is_verified']=df['verified'].apply(lambda x: 1 if x==x else 0)
        df['is_protected']=df['protected'].apply(lambda x: 1 if x==x else 0)
        df['profile_modified'] = df['default_profile'].apply(lambda x: 0 if x==x else 1)
        df = df.rename(index=str, columns={"screen_name": "username", "statuses_count": "total_tweets", "friends_count": "total_following", "followers_count": "total_followers", "favourites_count": "total_likes"})
        return df[['age', 'has_location', 'is_verified', 'total_tweets', 'total_following', 'total_followers', 'total_likes', 'has_avatar', 'has_background', 'is_protected', 'profile_modified']]

    def open_csv(self, file_name):
        with open(file_name) as csv_file:
            reader = csv.reader(csv_file)
            file = dict(reader)
        for key in file:
            file[key] = float(file[key])
        return file
    
    def create_model(self):
        input = Input(shape=[10])
        Layer_1 = Dense(500, activation='relu', kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01))(input)
        Layer_2 = Dense(200, activation='relu',kernel_regularizer=l2(0.01), bias_regularizer=l2(0.01))(Layer_1)
        Layer_3 = Dense(1, activation='sigmoid')(Layer_2)
        model = Model(input, Layer_3)
        return model
    
    def classify_as_bot_or_not(self,model_attributes):
        logging.info("Running Account Level Model")
        model_df = pd.DataFrame(model_attributes)
        clean_df = self.clean_df(model_df)
        account_df = clean_df.sample(frac=1).reset_index(drop=True)

        for i in account_df:
            account_df[str(i)]=int(account_df[str(i)])

        training_df_mean = self.open_csv(self.mean_csv)
        training_df_std = self.open_csv(self.std_csv)


        columns_to_standardize = ['age', 'total_tweets', 'total_following', 'total_followers', 'total_likes']
        for column in columns_to_standardize:
            account_df[column] = (account_df[column] - training_df_mean[column])/training_df_std[column]
        account_df = account_df.drop(['is_protected'], axis=1).values

        account_df[0]=np.asarray(account_df[0])
        account_df=np.asarray(account_df)

        mod = self.create_model()
        mod.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        mod.load_weights(self.model)
        logging.info("The account level model has been trained")
        print(mod.summary())
        prediction = mod.predict(account_df)
        self.account_summary["Final_Prediction"] = round(1 - prediction[0][0],3)
        print("##################################################################################")
        print("Account Tweet Model: The changes the account ",self.username," is a bot account is :", self.account_summary["Final_Prediction"])
        print("##################################################################################")
        print()
        logging.info("The Prediction has been made")
        logging.info("End of Account Model")
        return self.account_summary

