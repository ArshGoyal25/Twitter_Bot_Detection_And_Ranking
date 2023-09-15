import requests
import os
import json
import tweepy


class Connection:
    # keys and shiz
    consumer_key = ""
    consumer_secret = ""
    access_token = ""
    access_token_secret = ""
    bearer_token = ""

    #tweepy auth
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)

    def create_tweet_url(self,tweet_id):
        tweet_fields = "tweet.fields=lang,author_id,attachments"
        id = tweet_id
        url = "https://api.twitter.com/2/tweets/{}?&{}".format(id, tweet_fields)
        
        return url

    def create_user_url(self,author_id):
        # Specify the usernames that you want to lookup below
        # You can enter up to 100 comma-separated values.
        ids="ids={}".format(author_id)
        tweet_fields = "tweet.fields=lang,author_id,attachments"
        user_fields="username"
        url = "https://api.twitter.com/2/users?{}&user.fields={}".format(ids, user_fields)
        # print(url)
        return url

    def bearer_oauth(self,r):
        r.headers["Authorization"] = f"Bearer {self.bearer_token}"
        r.headers["User-Agent"] = "v2TweetLookupPython"
        return r

    def connect_to_endpoint(self,url):
        response = requests.request("GET", url, auth=self.bearer_oauth)
        # print(response.status_code)
        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
        return response.json()
