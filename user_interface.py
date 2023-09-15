from Twiter_API.twitter_connect import Connection
import json

class UI:
    def user_interface(self):
        criteria = input("1. Username \n2. Tweet ID \n3. User ID \nPlease give input(1/2/3): ")
        connection = Connection()
        if criteria == '1':
            username = input("Please enter username: ")

        if criteria == "2":
            tweet_id = input("Please enter tweet ID: ")
            url = connection.create_tweet_url(tweet_id)
            json_response = connection.connect_to_endpoint(url)
            user_id = json_response['data']['author_id']
            user_url = connection.create_user_url(user_id)
            user_json_response = connection.connect_to_endpoint(user_url)
            username = user_json_response['data'][0]['username']


        elif criteria == "3":
            user_id = input("Please enter user ID: ")
            print(user_id)
            user_url = connection.create_user_url(author_id = user_id)
            user_json_response = connection.connect_to_endpoint(user_url)
            username = user_json_response['data'][0]['username']
        
        return username
