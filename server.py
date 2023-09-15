# pyright: reportMissingImports=false, reportUntypedBaseClass=error
from flask import Flask, request
from flask_cors import CORS, cross_origin
from Twiter_API.twitter_connect import Connection
from Twiter_API.twitter_api import Twitter_API
from Bot_Detection.bot_detection import Bot_Detection
from Bot_Ranking.bot_ranking import Bot_Ranking
import logging
from Bot_Ranking.Social_Spam.social_spam import remove_punctuation_and_stopwords

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def get_username(data, type):
    connection = Connection()

    if type == "tweetId":
        tweet_id = data
        try:
            url = connection.create_tweet_url(tweet_id)
            json_response = connection.connect_to_endpoint(url)
            # print(json.dumps(json_response, indent=4, sort_keys=True))
            user_id = json_response['data']['author_id']
            user_url = connection.create_user_url(user_id)
            user_json_response = connection.connect_to_endpoint(user_url)
            username = user_json_response['data'][0]['username']
            return username
        except:
            return {
                "success": False,
                "message": "Invalid input"
            }

    if type == "userId":
        try:
            user_id = data
            user_url = connection.create_user_url(author_id = user_id)
            user_json_response = connection.connect_to_endpoint(user_url)
            username = user_json_response['data'][0]['username']
            return username
        except:
            return {
                "success": False,
                "message": "Invalid input"
            }

    return data

@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def main():
    if request.method == 'GET':
        return 'Server running!'
    body = request.json
    username = get_username(body['data'], body['type'])
    try:
        user = Connection.api.get_user(screen_name=username)
    except:
        return {
                "success": False,
                "message": "Invalid input"
        }

    account_display_info = Twitter_API.display_info(username)

    print("Beginning of Detection Phase")
    detection_model = Bot_Detection()
    classification, account_summary, tweet_summary, dna_summary, tweet_list, models_used= detection_model.classify_as_bot_or_not(username)
    print(classification)
    print("End of Detection Phase")

    print("Beginning of Ranking Phase")
    ranking_model = Bot_Ranking()
    ranking, hate_summary, tweets_with_hate, url_summary, tweets_with_url, spam_summary, tweets_with_spam = ranking_model.rank_account(username)
    print(ranking)
    print("End of Ranking Phase")

    return {
        'classification': classification,
        'ranking': ranking,
        'success': True,
        'account_display_info' : account_display_info,
        'account_summary': account_summary,
        'tweet_summary': tweet_summary,
        'dna_summary': dna_summary,
        'tweet_list': tweet_list,
        'hate_summary': hate_summary,
        'tweets_with_hate': tweets_with_hate,
        'url_summary': url_summary,
        'tweets_with_url': tweets_with_url,
        'spam_summary': spam_summary,
        'tweets_with_spam': tweets_with_spam,
        'models_used': models_used
    }


if __name__ == '__main__':
    app.run()