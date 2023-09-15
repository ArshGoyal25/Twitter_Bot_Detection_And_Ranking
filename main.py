# pyright: reportMissingImports=false, reportUnusedVariable=warning, reportUntypedBaseClass=error
from user_interface import UI
from Bot_Detection.bot_detection import Bot_Detection
from Bot_Ranking.bot_ranking import Bot_Ranking
from Twiter_API.twitter_api import Twitter_API
import logging
import string
from nltk.corpus import stopwords
from Bot_Ranking.Social_Spam.social_spam import remove_punctuation_and_stopwords

if __name__ == '__main__':
    logging.basicConfig(format='Date-Time : %(asctime)s : Line No. : %(lineno)d - %(message)s', \
                    level = logging.INFO)
    interface = UI()
    username = interface.user_interface()
    
    account_display_info = Twitter_API.display_info(username)

    logging.info("Beginning of Bot Detection Phase")
    detection_model = Bot_Detection()
    classification, account_summary, tweet_summary, dna_summary, tweet_list, models_used = detection_model.classify_as_bot_or_not(username)
    print(classification)
    logging.info("End of Bot Detection Phase")

    logging.info("Beginning of Bot Ranking Phase")
    ranking_model = Bot_Ranking()
    ranking, hate_summary, tweets_with_hate, url_summary, tweets_with_url, spam_summary, tweets_with_spam = ranking_model.rank_account(username)
    print(ranking)
    logging.info("End of Bot Ranking Phase")