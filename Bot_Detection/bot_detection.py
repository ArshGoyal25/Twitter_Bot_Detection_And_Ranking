import logging
from Twiter_API.twitter_api import Twitter_API
from Bot_Detection.Account_Level.account_level import Account_Model
from Bot_Detection.Tweet_Level.tweet_level import Tweet_Model
from Bot_Detection.Sequence_Level.sequence_level import Sequence_Model

class Bot_Detection:
    username = ""
    def __init__(self):
        self.account_level_attributes = None
        self.tweet_level_attributes = None
        self.seqeunce_level_attributes = None
        self.models_used = dict()

    def weighted_classification(self,account_summary, tweet_summary, dna_summary):

        use_dna_model = 1 if dna_summary['original_dna_size'] > 50 else 0
        use_tweet_model = 1 if (tweet_summary['Final_Prediction'] < 0.35 or tweet_summary['Final_Prediction'] > 0.65) else 0
        use_account_model = 1 if (int(self.account_level_attributes['followers_count'][0]) > 50 and 
            self.account_level_attributes['default_profile_image'][0] == 'False') else 0
        if self.account_level_attributes['verified'][0] == 'True':
            use_account_model = 1 

        print("Account", use_account_model)
        print("Tweet", use_tweet_model)
        print("DNA", use_dna_model)
        
        self.models_used['Account'] = use_account_model
        self.models_used['Tweet'] = use_tweet_model
        self.models_used['Sequence'] = use_dna_model

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
            

    def classify_as_bot_or_not(self,username):
        logging.info("Running Bot Detection model")
        self.username = username

        # These 3 variables contain the attributes for each model
        self.account_level_attributes = Twitter_API.account_level_info(username)
        self.tweet_level_attributes = Twitter_API.tweet_level_info(username)
        self.seqeunce_level_attributes = Twitter_API.DNA_model_info(username)

        # print("DNA Model Atttibutes", seqeunce_level_attributes)
        # print()
        # print("Account Level Attributes",self.account_level_attributes)
        # print()
        # print("Tweet Level Attributes", tweet_level_attributes)

        account_model = Account_Model(username)
        tweet_model = Tweet_Model(username)
        sequence_model = Sequence_Model(username)

        account_summary =  account_model.classify_as_bot_or_not(self.account_level_attributes)
        dna_summary = sequence_model.classify_as_bot_or_not(self.seqeunce_level_attributes)
        tweet_summary, tweet_list = tweet_model.classify_as_bot_or_not(self.tweet_level_attributes, dna_summary['Final_Prediction'], account_summary['Final_Prediction'])
        print("##################################################################################")
        print("The chances the account ",self.username," is a bot account as per difference models is:")
        print("Account Level: ", account_summary["Final_Prediction"])
        print("Tweet Level: ", tweet_summary['Final_Prediction'])
        print("Sequence: ", dna_summary['Final_Prediction'])
        print("##################################################################################")
        final_prediction =  self.weighted_classification(account_summary, tweet_summary, dna_summary)
        final_prediction = 1 if final_prediction == "Genuine" else 0
        logging.info("The Final Prediction has been made")
        return final_prediction, account_summary, tweet_summary, dna_summary, tweet_list, self.models_used


