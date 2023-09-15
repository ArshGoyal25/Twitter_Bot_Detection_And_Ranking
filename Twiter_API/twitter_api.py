from Twiter_API.twitter_connect import Connection
from datetime import date
class Twitter_API:
    def display_info(username):
        user = Connection.api.get_user(screen_name=username)
        user_id = str(user.id)
        account_data = dict()
        account_data['user_id'] = user_id
        account_data['name'] = [str(user.name)]
        account_data['screen_name'] = [str(user.screen_name)]
        account_data['created_at'] = [str(user.created_at)]
        account_data['lang'] = [str(user.lang)]
        
        account_data['location'] = [str(user.location)]
        account_data['profile location'] = [str(user.profile_location)]
        account_data['geo_enabled'] = [str(user.geo_enabled)]

        account_data['verified'] = [str(user.verified)]
        account_data['statuses_count'] = [str(user.statuses_count)]
        account_data['friends_count'] = [str(user.friends_count)]
        account_data['followers_count'] = [str(user.followers_count)]
        account_data['favourites_count'] = [str(user.favourites_count)]
        account_data['listed_count'] = [str(user.listed_count)]
        
        account_data['profile_image_url_https'] = [str(user.profile_image_url_https)]
        account_data['profile_background_image_url_https'] = [str(user.profile_background_image_url_https)]

        return account_data

    def account_level_info(username):
        user = Connection.api.get_user(screen_name=username)
        user_id = str(user.id)
        account_data = dict()
        account_data['user_id'] = user_id
        account_data['screen_name'] = [str(user.screen_name)]
        account_data['created_at'] = [str(user.created_at)]
        account_data['updated'] = [str(date.today())]
        account_data['location'] = [str(user.location)]
        account_data['verified'] = [str(user.verified)]
        account_data['statuses_count'] = [str(user.statuses_count)]
        account_data['friends_count'] = [str(user.friends_count)]
        account_data['followers_count'] = [str(user.followers_count)]
        account_data['favourites_count'] = [str(user.favourites_count)]
        account_data['default_profile_image'] = [str(user.default_profile_image)]
        account_data['profile_use_background_image'] = [str(user.profile_use_background_image)]
        account_data['protected'] = [str(user.protected)]
        account_data['default_profile'] = [str(user.default_profile)]
        return account_data


    def tweet_level_info(username):
        user = Connection.api.get_user(screen_name=username)

        #fetches 200 latest statuses on user's timeline. change the count attribute for testing/printing.
        try:
            timeline = Connection.api.user_timeline(screen_name = username, count = 200, include_rts = True)
            
            #list containing 200 latest tweets of the user
            tweets = []
            for status in timeline:
                tweets.append(status._json['text'])
            
            return tweets
        except:
            return []

    def DNA_model_info(username):
        user = Connection.api.get_user(screen_name=username)
        user_id = str(user.id)
        dna_data = dict()
        
        #dictionary containing all info required by DNA model
        dna_data['tweet_id'] = []
        dna_data['truncated_list'] = []
        dna_data['retweeted_status_id'] = []
        dna_data['in_reply_to_status_id'] = []
        dna_data['retweet_count'] = []
        dna_data['timestamp'] = []
        dna_data['user_id'] = user_id
        try:
            #fetches 200 latest statuses on user's timeline. change the count attribute for testing/printing.
            timeline = Connection.api.user_timeline(screen_name = username, count = 200, include_rts = True)

            for status in timeline:
                dna_data['tweet_id'].append(status._json['id'])
                if str(status._json['truncated']) == "False":
                    dna_data['truncated_list'].append(0)
                else:
                    dna_data['truncated_list'].append(1)
                
                if str(status._json['text'][0]) == "R" and str(status._json['text'][1]) == "T":
                    dna_data['retweeted_status_id'].append(1)
                else:
                    dna_data['retweeted_status_id'].append(0)
                
                if str(status._json['in_reply_to_status_id']) == "None":
                    dna_data['in_reply_to_status_id'].append(0)
                else:
                    dna_data['in_reply_to_status_id'].append(1)

                dna_data['retweet_count'].append(status._json['retweet_count'])
                dna_data['timestamp'].append(status._json['created_at'])

            return dna_data
        except:
            return dna_data