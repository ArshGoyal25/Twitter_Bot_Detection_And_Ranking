# Twitter_Bot_Detection_And_Ranking

Source code for a Twitter Bot Detection and Ranking System.

The Project consisted of two halves
• Classification of Twitter user accounts as bot or human
• Ranking of these accounts identified above to indicate their effectiveness/use case


Classification:
The classification step consists of 3 Models based on different feature sets to classify accounts:
1. Account Level Model - Trained on Account Meta Data
2. Tweet Level Model - Trained on Tweets made by Account
3. Sequence Level Model - Based on Account Tweeting History and Patterns

A rule-based algorithm is then used to combine the above results for a final Classification Result

Ranking:
The Ranking step consists of 3 Models based on different types of content in Tweets:
1. Spam Detection - To Detect Spam Content in Tweets
2. Hate Speech Detection - To Detect Hate Space Content in Tweets
3. Malicious URL Detection - To Detect Malicious URLs in Tweets

A rule-based algorithm is then used to combine the above results for a final Ranking Result

Web Application.

Further, a Web Application was developed to enable a user to view the characteristics of an account along with the Bot Detection and Ranking Result.
Technologies Used: ReactJS and JavaScript


1. Main Search Page
Landing Page which allowed users to search for accounts on Twitter based on Account UserName, Account ID, or Tweet ID. 

<img width="443" alt="image" src="https://github.com/ArshGoyal25/Twitter_Bot_Detection_And_Ranking/assets/56116730/eacb43fb-c675-4ec5-9fc7-46d48714c842">

2. Results Page

Based on the user query, Twitter API was used to extract relevant details of the account and pass them into the Machine Learning Models. 
The Machine Learning Models ran on the backend to generate Detection and Results. 
The Final Results along with other relevant information are then displayed back to the user.

<img width="452" alt="image" src="https://github.com/ArshGoyal25/Twitter_Bot_Detection_And_Ranking/assets/56116730/82ad71e6-693b-4baf-80fe-4024904cb518">

<img width="452" alt="image" src="https://github.com/ArshGoyal25/Twitter_Bot_Detection_And_Ranking/assets/56116730/c595f729-1d07-4830-bb95-4efb8e3f2312">

<img width="452" alt="image" src="https://github.com/ArshGoyal25/Twitter_Bot_Detection_And_Ranking/assets/56116730/991bcbb6-86f5-4cec-a74b-12d47eaed6a2">

<img width="452" alt="image" src="https://github.com/ArshGoyal25/Twitter_Bot_Detection_And_Ranking/assets/56116730/00e763fe-5a86-418c-9687-efb67fa1cde1">





