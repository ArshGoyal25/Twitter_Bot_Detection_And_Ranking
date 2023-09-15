# pyright: reportMissingImports=false, reportUnusedVariable=warning, reportUntypedBaseClass=error
from requests.api import get
from user_interface import UI
from Bot_Detection.bot_detection import Bot_Detection
from Bot_Detection.Account_Level.account_level import Account_Model
from Bot_Detection.Tweet_Level.tweet_level import Tweet_Model
from Bot_Detection.Sequence_Level.sequence_level import Sequence_Model
from Bot_Ranking.bot_ranking import Bot_Ranking
from Bot_Ranking.Hate_Speech.hate_speech import Hate_Speech_Model
from Bot_Ranking.Malicious_URL.malicious_URL import Malicious_URL_Model
from Bot_Ranking.Social_Spam.social_spam import Spam_Model
from Twiter_API.twitter_api import Twitter_API
import logging
import string
from Bot_Ranking.Social_Spam.social_spam import remove_punctuation_and_stopwords
import pandas as pd
from Twiter_API.twitter_connect import Connection


import os
dirname = os.path.dirname(__file__)
import csv

def get_username(user_id):
    connection = Connection()

    try:
        user_url = connection.create_user_url(author_id = user_id)
        user_json_response = connection.connect_to_endpoint(user_url)
        username = user_json_response['data'][0]['username']
        return username
    except:
        return "No"

def weighted_classification(account_level_attributes,account_summary, tweet_summary, dna_summary):

    use_dna_model = 1 if dna_summary['original_dna_size'] > 50 else 0
    use_tweet_model = 1 if (tweet_summary['Final_Prediction'] < 0.35 or tweet_summary['Final_Prediction'] > 0.65) else 0
    use_account_model = 1 if (int(account_level_attributes['followers_count'][0]) > 50 and 
        account_level_attributes['default_profile_image'][0] == 'False') else 0
    if account_level_attributes['verified'][0] == 'True':
        use_account_model = 1 

    print("Account", use_account_model)
    print("Tweet", use_tweet_model)
    print("DNA", use_dna_model)
    
    if use_account_model:
        if use_dna_model:
            if use_tweet_model:
                result = (account_summary['Final_Prediction'] + tweet_summary['Final_Prediction'] + dna_summary['Final_Prediction']) / 3
                return "Genuine" if result < 0.5 else "Bot"
            else:
                result = (account_summary['Final_Prediction'] + dna_summary['Final_Prediction']) / 2
                return "Genuine" if result < 0.4 else "Bot"
        else:
            if use_tweet_model:
                result = (account_summary['Final_Prediction'] + tweet_summary['Final_Prediction']) / 2
                return "Genuine" if result < 0.5 else "Bot"
            else:
                result = account_summary['Final_Prediction']
                return "Genuine" if result < 0.5 else "Bot"
    else:
        if use_dna_model:
            if use_tweet_model:
                result = (tweet_summary['Final_Prediction'] + dna_summary['Final_Prediction']) / 2
                return "Genuine" if result < 0.5 else "Bot"
            else:
                result = dna_summary['Final_Prediction']
                return "Genuine" if result < 0.5 else "Bot"
        else:
            if use_tweet_model:
                result = tweet_summary['Final_Prediction']
                return "Genuine" if result < 0.5 else "Bot"
            else:
                result = "No Classification"
                return result

if __name__ == '__main__':

    common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models_Test/')
    filename = os.path.join(common_path, 'labelled_test_accounts.csv')
    filename = '/Users/arshgoyal/Desktop/Capstone_Phase_2/Twitter-bot-detection/Models_Test/labelled_test_accounts.csv'
    file = open(filename)
    file = csv.reader(file)

    skip_count = 0
    run_count = 0
    correct_0 = 0
    wrong_0 = 0
    correct_1 = 0
    wrong_1 = 0
    for row in file:
        username = get_username(row[1])
        print(username)
        if(username == "No"):
            skip_count +=1
        else:
            run_count+=1
            detection_model = Bot_Detection()
            account_level_attributes = Twitter_API.account_level_info(username)
            tweet_level_attributes = Twitter_API.tweet_level_info(username)
            seqeunce_level_attributes = Twitter_API.DNA_model_info(username)

            account_model = Account_Model(username)
            tweet_model = Tweet_Model(username)
            sequence_model = Sequence_Model(username)

            account_summary =  account_model.classify_as_bot_or_not(account_level_attributes)
            dna_summary = sequence_model.classify_as_bot_or_not(seqeunce_level_attributes)
            tweet_summary, tweet_list = tweet_model.classify_as_bot_or_not(tweet_level_attributes, dna_summary['Final_Prediction'])

            final_prediction = weighted_classification(account_level_attributes, account_summary, tweet_summary, dna_summary)
            final_prediction = 1 if final_prediction == "Bot" else 0
            if final_prediction == 1:
                if(final_prediction == int(row[2])):
                    correct_1 += 1
                else:
                    wrong_1 += 1
            elif final_prediction == 0:
                if(final_prediction == int(row[2])):
                    correct_0 += 1
                else:
                    wrong_0 += 1
            print(final_prediction, type(final_prediction))
            print(row[2], type(row[2]))
        print("Correct_1", correct_1)
        print("Wrong_1", wrong_1)
        print("Correct_0", correct_0)
        print("Wrong_0", wrong_0)
        print("Skipped and run", skip_count, run_count)
    print("Accuracy= ", (correct_1 + correct_0) // run_count)