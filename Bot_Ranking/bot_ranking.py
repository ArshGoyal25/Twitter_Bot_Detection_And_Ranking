import logging
from Twiter_API.twitter_api import Twitter_API
from Bot_Ranking.Hate_Speech.hate_speech import Hate_Speech_Model
from Bot_Ranking.Malicious_URL.malicious_URL import Malicious_URL_Model
from Bot_Ranking.Social_Spam.social_spam import Spam_Model

class Bot_Ranking:
    username = ""
    def weighted_classification(self,hate,url, spam):
        if url:
            return "Bad"
        elif (hate) > 0.1:
            return "Bad"
        elif (hate) > 0.05:
            return "Neutral"
        elif (spam) > 0.1:
            return "Neutral"
        return "Good"

    def rank_account(self,username):
        logging.info("Running Bot Ranking model")
        self.username = username

        # These 3 variables contain the attributes for each model
        tweet_level_attributes = Twitter_API.tweet_level_info(username)

        hate_speech_model = Hate_Speech_Model(username)
        malicious_url_model = Malicious_URL_Model(username)
        social_spam_model = Spam_Model(username)

        hate_summary, tweets_with_hate = hate_speech_model.rank_account(tweet_level_attributes)
        url_summary, tweets_with_url = malicious_url_model.rank_account(tweet_level_attributes)
        spam_summary, tweets_with_spam = social_spam_model.rank_account(tweet_level_attributes)
        print("##################################################################################")
        print("The results of the account ",self.username," as per difference models is:")
        print("%Tweets containing Hate Speech Detection: ", hate_summary['Percentage_tweets_with_hate'])
        print("No of Tweets containing Malicious URL: ", url_summary['Malicious_Url'])
        print("%Tweets containing Spam Detection: ", spam_summary['Percentage_tweets_with_spam'])
        print("##################################################################################")
        final_prediction =  self.weighted_classification(hate_summary['Percentage_tweets_with_hate'], url_summary['Malicious_Url'], spam_summary['Percentage_tweets_with_spam'])
        logging.info("The Final Prediction has been made")
        return final_prediction, hate_summary, tweets_with_hate, url_summary, tweets_with_url, spam_summary, tweets_with_spam