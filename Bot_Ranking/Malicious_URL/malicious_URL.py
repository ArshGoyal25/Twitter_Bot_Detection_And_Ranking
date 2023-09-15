# pyright: reportMissingImports=false, reportUntypedBaseClass=error
import requests
import time
import json
import os
import logging
import re
import pandas as pd
import numpy as np
import urlexpander
import urllib
from urllib.parse import urlparse
dirname = os.path.dirname(__file__)
from collections import defaultdict

class Malicious_URL_Model():
    def __init__(self, username):
        self.username = username
        self.common_path = os.path.join(os.path.dirname(__file__), '../../', 'Models/')
        # self.filename = os.path.join(self.common_path, 'sequence_model.pkl')
        self.API_key = '19950eca61e77f81dd5fa66db75a437690f10e98382c6cc7ea30e244c39033b2'
        self.url = 'https://www.virustotal.com/vtapi/v2/url/report'
        self.url_summary = defaultdict(int)
        self.tweets_with_url = list()
        self.tweets_with_url.append(['Tweet', 'Classification'])

    def extract_urls(self,string):
        # print("HERE", string)
        urls=re.compile(r'(?:http|ftp|https)://(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?')
        url_list = []
        for url in re.findall(urls, string):
            url_list.append(url)
        return url_list  

    def expand_url(self, url_mini):
        url_temp=urlexpander.expand(url_mini)
        parsed_uri = urlparse(url_temp)
        result = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
        return(result)

    def clean_tweets(self,tweets):
        tweets_with_url = []
        for tweet in list(tweets):
            try:
                url_list = self.extract_urls(tweet)
                if(url_list):
                    tweets_with_url.append(url_list)
            except:
                tweet=''
                # tweets_with_url.append(tweet)

        return tweets_with_url

    def rank_account(self, model_attributes):
        logging.info("Running Malicious URL Detection")
        self.url_summary["Total_Tweets_Analysed"] = len(model_attributes)
        url_list = self.clean_tweets(model_attributes)
        logging.info("The URLs have been extracted")    
        self.url_summary['Tweets_containing_url'] = len(url_list)
        url_list = url_list[0:2]
        for i in url_list:
            try:
                url = self.expand_url(i[0])
            except:
                url = i[0]
            try:
                parameters = {'apikey': self.API_key, 'resource': url}
                response= requests.get(url=self.url, params=parameters)
                json_response= json.loads(response.text)
                if json_response['response_code'] <= 0:
                    print("Not found")
                elif json_response['response_code'] >= 1:
                    if json_response['positives'] <= 0:
                        print("Not Malicious")
                        self.tweets_with_url.append([url,"Not Malicious"])
                    else:
                        print("Malicious")
                        self.tweets_with_url.append([url,"Malicious"])
                        self.url_summary['Malicious_Url'] += 1 
            except:
                self.tweets_with_url.append([url,"Not Malicious"])
                break

        self.url_summary['Percentage_tweets_with_url'] = round(self.url_summary['Tweets_containing_url']/ self.url_summary["Total_Tweets_Analysed"] ,2)
        print("##################################################################################")
        print("Malicious URL Detection: The account ",self.username," has ", self.url_summary['Percentage_tweets_with_url'], "% of tweets with URLs out of which", self.url_summary['Malicious_Url'] ,"are dangerous")
        print("##################################################################################")
        print()
        logging.info("The API has been run")
        logging.info("End of Malicious URL Detection")
        print(self.url_summary)
        print(self.tweets_with_url)

        return self.url_summary, self.tweets_with_url
                      





      
