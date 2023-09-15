import React from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '../utils/alert';
import Tooltip from '@mui/material/Tooltip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import account_image from '../components/Account_level_diagram.png'
import tweet_image from '../components/Tweet_level_diagram.png'
import sequence_image from '../components/Sequence_level_diagram.png'
import hate_image from '../components/Hate_speech_diagram.png'
import spam_image from '../components/Spam_detection_diagram.png'
import malicious_image from '../components/Malicious_url_diagram.png'
import detection_chart from '../components/Detection_Chart.png'
import ranking_chart from '../components/Ranking_Chart.png'



const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const COLORS = ['green', 'red'];
const COLORS_DNA = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const COLORS_RANK = ['green', 'red', '#FFBB28', '#FF8042'];


const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// const test_data = {
//     classification: 1,
//     ranking: 'Good',
//     account_display_info: {'user_id': '78941611', 'name': ['Harsha Bhogle'], 'screen_name': ['bhogleharsha'], 'created_at': ['2009-10-01 16:18:03+00:00'], 'lang': ['None'], 'location': ['Mumbai, India'], 'profile location': ['None'], 'geo_enabled': ['False'], 'verified': ['True'], 'statuses_count': ['62406'], 'friends_count': ['166'], 'followers_count': ['8758635'], 'favourites_count': ['12'], 'listed_count': ['6201'], 'profile_image_url_https': ['https://pbs.twimg.com/profile_images/1399217176343547904/rFLGp2F7_normal.jpg'], 'profile_background_image_url_https': ['https://abs.twimg.com/images/themes/theme1/bg.png']},
//     account_summary: {'Final_Prediction': 0.1},
//     tweet_summary: {'Total_Tweets_Present': 200, 'Total_Bots': 9.0, 'Total_Tweets_Analysed': 52.0, 'Total_Genuine': 43.0, 'Final_Prediction': 0.173},
//     tweet_list: [['Tweet', 'Classification', 'Estimate'], ['Seems like a good date to be born on of you want to play cricket.', 'Genuine', 1.0], ['Inevitable. This is a quality test side. Very very difficult to beat at home.', 'Genuine', 1.0], ['@mayankcricket Cheers. Wish you many more.', 'Genuine', 0.912], ["Agree. As if the programme he was watching was on a commercial break and he didn't want to miss anything .. https://t.co/ZhZQiTKLbf", 'Genuine', 1.0], ['@pratik80s Do read words 14-23', 'Genuine', 1.0], ['Wish @imAagarkar a happy birthday and a great year in the commentary box.', 'Bot', 0.755], ['Your hometown never lets you down, does it!', 'Bot', 0.897], ['Wonderful wonderful achievement and such a beautiful story. Delighted for you #AjazPatel.', 'Genuine', 1.0], ['All ten maybe? #AjazPatel', 'Genuine', 0.967], ['Side-effect of being there. Got to present an award to someone whose skill I am in awe of. @maheshmkale https://t.co/jVO3UVJdJi', 'Genuine', 0.942], ['Good to see #MissionISRO win in the Best Science, Tech &amp; Business category at the Asia Podcast Fest. Reminder that… https://t.co/FfW6wiUfSK', 'Genuine', 0.995], ['And who got it right among these four?', 'Genuine', 0.838], ['So now that you have had time to digest it, which team do you think got their retentions right. (1/2)', 'Genuine', 1.0], ['Thanks @AbhijitBhaduri. Coming from a top HR professional, it is very satisfying. https://t.co/UvZzN4zGQ1', 'Genuine', 0.981], ['So enjoying being home and doing sessions of #TheWinningWay through digital platforms. Reminds me that there is a w… https://t.co/snXbZ2edfp', 'Genuine', 0.973], ['I really enjoyed being at the #lokmatdigitalinfluencerawards today. Blown away by the kind of talent on digital, th… https://t.co/JprPPEmRoB', 'Genuine', 0.965], ['I never thought I would need an umbrella in December in Mumbai......', 'Bot', 0.866], ['Interesting to see the emotion, from fans and players, as the retentions become clear. As the #IPL grows, this iden… https://t.co/dHpEOLiagD', 'Genuine', 0.979], ['@krishnatejasvi_ @YouTube Thank you. I knew Sachin well so I could relate to what he was feeling ...', 'Genuine', 0.96], ['Skin of their teeth. Light will go anytime now. What a finish', 'Bot', 0.411], ['@wvraman 45 for  no loss in the first hour. Game on!', 'Genuine', 0.972], ['See how the balance of the team changes in Indian conditions with each of the three spinners capable of contributin… https://t.co/ebEcSw22Tc', 'Genuine', 0.993], ["India's batting continues to display brittleness. Will need to hang in and stretch this lead to about 250 at least", 'Bot', 0.732], ['Very nice. Do watch the entire conversation. https://t.co/McDKrxqIKW', 'Genuine', 1.0], ['There are four issues around the retentions at the #IPL that caught my attention. This is the first of those. Shrey… https://t.co/8N77HCtf9L', 'Genuine', 0.933], ['Ha! Look what turned up! https://t.co/g1W7syXxz9', 'Genuine', 0.998], ['Never forget. 26/11. So many brave people, so many great people. And a few cruel people. Never again.', 'Genuine', 1.0], ['This is already a very good score. Anything from here is a bonus. The bowlers will be happy.', 'Genuine', 0.862], ['Another test series but conditions very different from England in June! Big series for a couple of players. It is a… https://t.co/fR7fQg90Z5', 'Genuine', 1.0], ['RT @DineshKarthik: I feel TNPL has helped and also the fact that this set of boys wanted to DESPERATELY be part of IPL and from there hopef…', 'Genuine', 1.0], ["I thought so. But I wasn't sure that was the only reason or whether there was something else in the set-up https://t.co/xUbLvWifJq", 'Genuine', 0.987], ['@sassypenguin08 Timeline might be a problem for you. Always better to breathe a bit. Take care.', 'Genuine', 1.0], ['Enjoyed this conversation https://t.co/cXGlTcPEHa', 'Genuine', 1.0], ['Lara genius. AB genius. https://t.co/FYJXLkupym', 'Bot', 0.829], ['There is no doubt in my mind that @ABdeVilliers17 has been one of the most influential players of his generation. A… https://t.co/wsUQEl5BoJ', 'Genuine', 1.0], ["@Aayued We didn't", 'Genuine', 1.0], ['I have seen that change with people I have worked with too. And it is welcome, which is why I am hopeful that out o… https://t.co/YEJV4jy2nL', 'Genuine', 0.988], ['RT @BhogleAnita: You brought back wonderful memories!', 'Bot', 0.883], ['@vikramsathaye Haha, now you only need to look for 9!', 'Genuine', 0.999], ['@cricketaakash Will happen by and by I am sure. And for that, we will need the IPL to throw up a crop of 5/6/7 kind of players.', 'Genuine', 0.79], ['@limitlessme @beastieboy07 He is one of our brightest talents. Words obey him.', 'Genuine', 0.916], ['Enjoyed it. Great crew. Very pleasant experience. https://t.co/PNTb5bzPvA', 'Genuine', 1.0], ['Lovely surface by the looks of it. The people in charge of the pitches have done a phenomenal job. Would love to se… https://t.co/9Dk9wFcQXX', 'Genuine', 0.993], ['Privileged to be part of the crew for the final of the #ICCT20WorldCup. It is a wonderful occasion and I hope we get a good game.', 'Genuine', 0.233], ['Oh dear, I wasn\'t aware. This is so sad. "How are you chief", he would say when he called. My condolences to Partha… https://t.co/ldJ2E3NhUH', 'Genuine', 0.977], ['Lovely https://t.co/ICOB240xZp', 'Genuine', 0.999], ['@kushansarkar He could have played two tests...at least one...', 'Genuine', 1.0], ['I know sport can sometimes be cruel but I cannot see children crying.....', 'Genuine', 0.999], ['Twice in two days we have thought the bowling side had it covered. Twice it has ended with an over left. There is n… https://t.co/z5PkKZDlol', 'Genuine', 0.999], ['What!! https://t.co/KeUVtqhfSF', 'Genuine', 1.0], ["Top innings from Warner but that wicket was the game changer. Pakistan's game to lose now", 'Genuine', 1.0], ['With any other bowling side, this would only have been a par score. https://t.co/ILfm3suL0a', 'Genuine', 1.0], ['They are getting it.... https://t.co/vv4KcskX0O', 'Genuine', 0.999], ['Australia have bowled better than this.....', 'Genuine', 1.0], ['If you want to reach out to her, here is the link again\nhttps://t.co/rukFUvyaXf\n\nAnd she is at @mugdhakalra\n\nCheers. https://t.co/JKWkoOBFIP', 'Bot', 0.879], ['There are many people doing outstanding selfless work in this area. Since you mentioned autism awareness @CricCrab,… https://t.co/3KJDIrTjWP', 'Genuine', 1.0]],
//     dna_summary: {'total_tweets': 200, 'num_tweets': 102, 'num_replies': 21, 'num_retweets': 77, 'DNA': 'CCCCCCAAATAAATCCCCAAAATTTTTTATAACCATCCCAAACCACAACCCACTAATAAACAAACCCCCCTAAATAAACCCCAAAAAACCCCCAACCCACCACCAAAAAAAAAAAAACCCCAAAAATACAACACCAAAAAAACCAAAAAAAAAAAAACTCACCCCACTCAAACTAAAATCAACCATACCCTAACCCCCCC', 'original_dna_size': 233, 'compressed_dna_size': 106, 'compression_ratio': 2.19811320754717, 'Final_Prediction': 0.0},
//     hate_summary: {'Total_Tweets_Analysed': 200, 'Tweets_without_hate': 198, 'Tweets_with_hate': 15, 'toxic': 2, 'Percentage_tweets_with_hate': 0.01},
//     tweets_with_hate: [['tweet', 'toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate'], ['Saalgirah Mubarak @MohammadKaif. Khush rahen, fit rahen. Aapke liye dono mushkil nahi!', 0.3, 0.009, 0.113, 0.006, 0.07, 0.007], ['@manish_sisodiya Itne meethe shabdon mein agar koi bayaan kare to kubool karna mushkil nahi. Dhanyavad.', 0.223, 0.019, 0.186, 0.007, 0.111, 0.029]],
//     url_summary: {'Total_Tweets_Analysed': 200, 'Tweets_containing_url': 83, 'Percentage_tweets_with_url': 0.41, 'Malicious_Url': 5},
//     tweets_with_url: [['Tweet', 'Classification'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['http://t.co/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://www.youtube.com/', 'Not Malicious'], ['https://www.cricbuzz.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://www.bbc.co.uk/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious'], ['https://twitter.com/', 'Not Malicious']],
//     spam_summary: {'Total_Tweets_Analysed': 200, 'Tweets_containing_spam': 10, 'Percentage_tweets_with_spam': 0.0},
//     tweets_with_spam: [['Tweet', 'Estimate']],
// }



const Main = () => {
    const [username, setUsername] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [tweetId, setTweetId] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [response, setResponse] = React.useState(null);
    const [currentTab, setCurrentTab] = React.useState('submit');

    const [openAccount, setOpenAccount] = React.useState(false);
    const [openTweet, setOpenTweet] = React.useState(false);
    const [openSequence, setOpenSequence] = React.useState(false);
    const [openRanking, setOpenRanking] = React.useState(false);
    const [openFinalDetection, setOpenFinalDetection] = React.useState(false);
    const [openFinalRanking, setOpenFinalRanking] = React.useState(false);


    const [alert, setAlert] = React.useState({
        open: false,
        type: '',
        message: ''
    })

    const showAlert = (message, type) => {
        setAlert({
            open: true,
            message,
            type
        })
    }

    const closeAlert = () => {
        setAlert({
            open: false,
            message: '',
            type: ''
        })
    }

    const hateSum = (tweet) => {
        let sum = 0
        for (let i = 1; i < tweet.length; i++){
            sum += tweet[i]
        }
        sum = sum.toFixed(3)
        return sum       
    }

    const sendData = (data, type) => {
        const body = {
            data,
            type
        }
        setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        //     setCurrentTab('result');
        //     setResponse(test_data);
        //     showAlert('Fetched data', 'success');
        // }, 1000)
        axios.post('http://127.0.0.1:5000/', body)
            .then(res => {
                setLoading(false);
                if(res.data.success === false) {
                    setResponse(null);
                    return showAlert(res.data.message, 'error');
                }
                setResponse(res.data);
                setCurrentTab('result');
                showAlert('Fetched data', 'success');
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setResponse(null);
                showAlert('Internal server error, please try again', 'error')
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, userId, tweetId);
        if(username) {
            sendData(username, 'username');
        } else if(userId) {
            sendData(userId, 'userId');
        } else if(tweetId) {
            sendData(tweetId, 'tweetId');
        } else {
            showAlert('Please enter one of the fields', 'warning');
        }
    }

    const rankingColors = {
        Good: 'text-green-500',
        Neutral: 'text-yellow-500',
        Bad: 'text-red-500'
    };

    const goodTweets = () => {
        let result = response.hate_summary.Total_Tweets_Analysed
        result -= response.hate_summary.Tweets_with_hate
        result -= response.spam_summary.Tweets_containing_spam
        result -= response.url_summary.Malicious_Url
        return result
    }

    const RankingReason = () => {
        let reason = 0
        if (response.ranking === "Good"){
            reason = "High Percentage of Clean Tweets"
        }else if (response.url_summary.Malicious_Url >= 1){
            reason = 'Contains Malicious URL'
        } else if (response.hate_summary.Percentage_tweets_with_hate > response.spam_summary.Percentage_tweets_with_spam){
            if (response.hate_summary.Percentage_tweets_with_hate > 0.1){
                reason = 'Excessive Hate Content'
            } else{
                reason = 'Moderate Hate Content'
            }
        }else{
            reason = 'Moderate Spam Content'
        }
        return reason
    }

    const handleOpenDetails = (type) => () => {
        if (type === 'account'){
            setOpenAccount(true)
        } else if (type === 'tweet'){
            setOpenTweet(true)
        } else if (type === 'sequence'){
            setOpenSequence(true)
        } else if(type === 'ranking'){
            setOpenRanking(true)
        } else if(type === 'final_detection'){
            setOpenFinalDetection(true)
        } else if(type === 'final_ranking'){
            setOpenFinalRanking(true)
        }
    };
    
    const handleCloseDetails = (type) => () => {
        if (type === 'account'){
            setOpenAccount(false)
        } else if (type === 'tweet'){
            setOpenTweet(false)
        } else if (type === 'sequence'){
            setOpenSequence(false)
        } else if(type === 'ranking'){
            setOpenRanking(false)
        } else if(type === 'final_detection'){
            setOpenFinalDetection(false)
        } else if(type === 'final_ranking'){
            setOpenFinalRanking(false)
        }
    };

    let content = (
        <div className='flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center w-full justify-center'>
            <div className='w-96 rounded bg-white shadow-md px-8 pt-6 pb-2 h-96'>
                <form className="rounded mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            User ID
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter user id"
                            onChange={(e) => setUserId(e.target.value)}
                            value={userId}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tweet ID
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter tweet id"
                            onChange={(e) => setTweetId(e.target.value)}
                            value={tweetId}
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
                <p className='text-gray-400 text-sm mb-2'>*You may submit any one of the above fields</p>
            </div>
        </div>
    )

    if(currentTab === 'result') {
        content = (
            response ? (
                <div className='w-4/5 mx-auto mt-10 mb-12'>
                    <div className='flex w-full'>
                        <div className='w-1/2 p-3 rounded bg-gray-100 mx-2 text-center'>
                            <p className={`mr-2 text-5xl ${response.classification === 1? 'text-green-500': 'text-red-500'}`}>{response.classification === 1? 'Genuine Account': 'Bot Account'} </p>
                        </div>
                        <div className='w-1/2 p-3 rounded bg-gray-100 mx-2 text-center'>
                            <p className={`text-5xl ${rankingColors[response.ranking]}`}>{response.ranking}</p>
                        </div>
                    </div>
                    <div className='mt-2 flex w-full'>
                        <div className='w-1/2 x-2 text-right mr-2'>
                            <Button variant="outlined" onClick={handleOpenDetails('final_detection')}>Classification Result Details</Button>
                            <Dialog open={openFinalDetection} onClose={handleCloseDetails('final_detection')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                                <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Detection System Overview</DialogTitle>
                                <DialogContent className='bg-gray-100' dividers>
                                    <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                        <div>
                                            <p>The Detection System predicts whether a given Twitter account is a bot or human. 
                                                To make the prediction, the outputs of 3 different machine learning models are combined</p>
                                            <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                                <img className='h-100' src={detection_chart} alt = "Not Available"></img>
                                            </div>
                                            <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Detection Overview</p>
                                            <table className='w-full mt-4 table-auto' style={{maxHeight: '200px', overflowX: 'scroll'}}>
                                                <tbody>
                                                    <tr className='border-b border-t bg-gray-200 border-gray-400'>
                                                        <td className='text-base font-semibold py-3 px-2'>COMPONENT NAME</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>MACHINE LEARNING ALGORITHM USED</td> */}
                                                        <td className='text-base font-semibold py-3 px-5'>MODEL USED WHEN</td>
                                                        <td className='text-base font-semibold py-3 px-5'>USED?</td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Account Level Model</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>Feed forward Neural network (ANN)</td> */}
                                                        <td className='text-base py-3 px-5'>Majority of Account Features defined</td>
                                                        <td className={`text-base py-3 px-5 ${response.models_used.Account === 1? 'text-green-500': 'text-red-500'}`}> {response.models_used.Account === 1? 'Yes': 'No'} </td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Tweet Level Model</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>LSTM network</td> */}
                                                        <td className='text-base py-3 px-5'>Clear Majority Class Present</td>
                                                        <td className={`text-base py-3 px-5 ${response.models_used.Tweet === 1? 'text-green-500': 'text-red-500'}`}> {response.models_used.Tweet === 1? 'Yes': 'No'} </td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Sequence Level Model </td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>Compression + Logistic Regression</td> */}
                                                        <td className='text-base py-3 px-5'>DNA Sequence Length greater than 50 </td>
                                                        <td className={`text-base py-3 px-5 ${response.models_used.Sequence === 1? 'text-green-500': 'text-red-500'}`}> {response.models_used.Sequence === 1? 'Yes': 'No'} </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                                <p className='mt-2 mb-2 text-3xl text-indigo-900'> Combined Accuracy: 95.7%</p>
                                            </div>
                                        </div>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDetails('final_detection')}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div className='w-1/2 x-2 text-right mr-2'>
                            <Button variant="outlined" onClick={handleOpenDetails('final_ranking')}> Ranking Result Details</Button>
                            <Dialog open={openFinalRanking} onClose={handleCloseDetails('final_ranking')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                                <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Ranking System Overview</DialogTitle>
                                <DialogContent className='bg-gray-100' dividers>
                                    <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                        <div>
                                            <p> The Account Ranking module predicts the impact of a Twitter account on the community.
                                                The result can either one of good account, bad account or neutral account.
                                                To make the prediction, the outputs of 3 different machine learning models are combined</p>
                                            <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                                <img className='h-100' src={ranking_chart} alt = "Not Available"></img>
                                            </div>
                                            <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Ranking Overview</p>
                                            <table className='w-full mt-4 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                                <tbody>
                                                    <tr className='border-b border-t bg-gray-200 border-gray-400'>
                                                        <td className='text-base font-semibold py-3 px-2'>COMPONENT NAME</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>MACHINE LEARNING ALGORITHM USED</td> */}
                                                        <td className='text-base font-semibold py-3 px-5'>WEIGHTAGE GIVEN WHEN</td>
                                                        <td className='text-base font-semibold py-3 px-5'>CONSIDERED?</td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Hate Speech</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>CNN + GRU</td> */}
                                                        <td className='text-base py-3 px-5'> More than 5% of tweets contain hate</td>
                                                        <td className={`text-base py-3 px-5 ${response.hate_summary.Percentage_tweets_with_hate >= 0.05? 'text-red-500': 'text-green-500'}`}> {response.hate_summary.Percentage_tweets_with_hate >= 0.05? 'Yes': 'No'} </td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Malicious URL</td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>API call to third-party service</td> */}
                                                        <td className='text-base py-3 px-5'>One or more malicious URL are found</td>
                                                        <td className={`text-base py-3 px-5 ${response.url_summary.Malicious_Url >= 1? 'text-red-500': 'text-green-500'}`}> {response.url_summary.Malicious_Url >= 1? 'Yes': 'No'} </td>
                                                    </tr>
                                                    <tr className='border-b bg-white border-gray-400'>
                                                        <td className='text-base py-3 px-2'>Social Spam </td>
                                                        {/* <td className='text-base font-semibold py-3 px-5'>Multinomial Naive Bayes</td> */}
                                                        <td className='text-base py-3 px-5'>More than 10% of tweets contain spam</td>
                                                        <td className={`text-base py-3 px-5 ${response.spam_summary.Percentage_tweets_with_spam >= 0.1? 'text-red-500': 'text-green-500'}`}> {response.spam_summary.Percentage_tweets_with_spam >= 0.1?  'Yes': 'No'} </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                                <p className='mt-2 mb-2 text-3xl text-indigo-900'> Combined Accuracy: N/A</p>
                                            </div>
                                        </div>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDetails('final_ranking')}>Close</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <p className='text-3xl font-semibold text-indigo-900 mr-2'>Account Level Analysis</p>                   
                        <Button variant="outlined" onClick={handleOpenDetails('account')}>Details</Button>
                        <Dialog open={openAccount} onClose={handleCloseDetails('account')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                            <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Account Level Model</DialogTitle>
                            <DialogContent className='bg-gray-100' dividers>
                                <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                    <div>
                                        <p>This model uses only the user's account information to detect if that account is bot or human.</p>
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Feed Forward Neural Network</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Number of Input Featues</td>
                                                    <td className='text-base font-semibold py-3 px-5'>10</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Number of Hidden Layers </td>
                                                    <td className='text-base font-semibold py-3 px-5'>3</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Value between 0 and 1</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Optmizer</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Adam Optimizer</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Loss Function</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Binary Cross Entropy</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='h-100 w-4/5' src={account_image} alt = "Not Availble"></img>
                                        </div>
                                        <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Model Architecture</p>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Accuracy: 91.42%</p>
                                        </div>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDetails('account')}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className='flex mt-1'>
                        <div className='w-2/3 shadow-lg rounded-xl flex p-3'>
                            <div className='w-20 h-20 bg-black' style={{borderRadius: '100%', background: `url('${response.account_display_info.profile_image_url_https}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}} >
                            </div>
                            <div className='flex-grow ml-4'>
                                <div className='flex'>
                                    <p className='text-xl font-bold'>{response.account_display_info.name[0]}</p>
                                    {response.account_display_info.verified[0] === 'True' && (
                                        <div className='w-6 h-6 bg-blue-400 rounded-xl flex items-center justify-center ml-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    <p className='flex-grow'></p>
                                </div>
                                <div className='flex'>
                                    <a className='text text-gray-500' href={`https://twitter.com/${response.account_display_info.screen_name[0]}`}>
                                        @{response.account_display_info.screen_name[0]}
                                    </a>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> <b> {response.account_display_info.friends_count[0]} </b> Following</p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> <b> {response.account_display_info.followers_count[0]} </b> Followers</p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> <b> {response.account_display_info.favourites_count[0]} </b> Status Favourites</p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> <b> {response.account_display_info.listed_count[0]} </b> Public Lists</p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Joined: <b> {(() => {const date = new Date(response.account_display_info.created_at[0]); return date.toLocaleString();})()} </b> </p>
                                    <p className='flex-grow'></p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'>Location: <b> {response.account_display_info.location[0]} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'>Language: <b> {response.account_display_info.lang[0]} </b> </p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'>Profile location: <b> {response.account_display_info['profile location'][0]} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'>Geo enabled: <b>{response.account_display_info.geo_enabled[0]} </b> </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/3 bg-gray-100 ml-2 rounded-xl shadow-lg flex flex-col items-center justify-center'>
                            <div className='flex'>
                                <p className=''>Account Level Prediction</p>
                                <Tooltip title="Higher the value, higher the chance of Genuine Account and vice versa">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                        <line x1="12" y1="19" x2="12" y2="19.01"></line>
                                    </svg>
                                </Tooltip>
                            </div>
                            
                            <div className='flex items-center justify-center'>
                                <p className={`text-7xl ${(1 - response.account_summary.Final_Prediction) * 100 >= 50? 'text-green-500': 'text-red-500'}`}>{((1 - response.account_summary.Final_Prediction) * 100).toFixed(1)}</p>
                                <p className={`text-3xl ${(1 - response.account_summary.Final_Prediction) * 100 >= 50? 'text-green-500': 'text-red-500'}`}>%</p>
                            </div>
                            <div className='flex'>
                                <p className='mr-1'> Final Classification: </p>
                                <p className={` ${response.account_summary.Final_Prediction *100 <= 50? 'text-green-500': 'text-red-500'}`}> <b> {response.account_summary.Final_Prediction *100 <= 50? ' Genuine': ' Bot'}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <p className='text-3xl font-semibold text-indigo-900 mr-2'>Tweet Level Analysis</p>                   
                        <Button variant="outlined" onClick={handleOpenDetails('tweet')}>Details</Button>
                        <Dialog open={openTweet} onClose={handleCloseDetails('tweet')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                            <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Tweet Level Model</DialogTitle>
                            <DialogContent className='bg-gray-100' dividers>
                                <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                    <div>
                                        <p> This model focuses on assigning a user account as a human or genuine based only on the content of the tweets.
                                        The latest 200 status updates of the account are passed as a list and each update is analysed individually.</p>
                                        <p> Each Tweet is pre processed initially and all stop words, urls and  account names are replaced by placeholders</p>
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Bi-directional LSTM</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='w-2/5 text-base py-3 px-2'>Number of Input Featues</td>
                                                    <td className='w-3/5 text-base font-semibold py-3 px-5'>Vector of Length 250</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Number of Hidden Layers </td>
                                                    <td className='text-base font-semibold py-3 px-5'>6 (LSTM + 2 Dense + 2 Dropout + Embedding)</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Value between 0 and 1 for each tweet (for 6 classes)</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Optmizer</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Adam Optimizer</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Loss Function</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Binary Cross Entropy</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='h-100 w-3/5' src={tweet_image} alt = "Not Availble"></img>
                                        </div>
                                        <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Model Architecture</p>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Accuracy: 76.04%</p>
                                        </div>
                                        {/* <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Evaluation Accuracy: 95.04%</p>
                                        </div>                       */}

                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDetails('tweet')}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className='flex mt-1'>
                        <div className='w-2/3 flex flex-col'>
                            <div className='w-full shadow-lg rounded-xl flex flex-col p-3'> 
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Total Status Updates: <b> {response.tweet_summary.Total_Tweets_Analysed} </b></p>
                                    <p className='flex-grow'></p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Genuine Status Count: <b> {response.tweet_summary.Total_Genuine} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> Percent Genuine: <b> {(response.tweet_summary.Total_Genuine / response.tweet_summary.Total_Tweets_Analysed * 100).toFixed(1)} % </b></p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Bot Type Status Count: <b> {response.tweet_summary.Total_Bots} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> Percent Bot: <b> {(response.tweet_summary.Total_Bots / response.tweet_summary.Total_Tweets_Analysed * 100).toFixed(1)} % </b></p>
                                </div>
                            </div>
                            <table className='w-full rounded-xl'>
                                <thead className='bg-gray-100 '>
                                    <tr>
                                        <td className='font-bold text-xl w-8/12 p-2'>Tweet</td>
                                        <td className='font-bold text-xl w-1/12 p-2'>Class</td>
                                        <td className='font-bold text-xl w-1/12 p-2'>Prob</td>
                                    </tr>
                                </thead>
                            </table>
                            <table className='w-full block' style={{maxHeight: '250px', overflowY: 'scroll'}}>
                                <tbody>
                                    {response.tweet_list.slice(1, response.tweet_list.length).map(tweet => (
                                        <tr className='border-b border-gray-400'>
                                            <td className='text-lg py-3 w-6/8 px-2'>{tweet[0]}</td>
                                            <td className='text-lg py-3 w-1/8 px-2'>{tweet[1]}</td>
                                            <td className='text-lg py-3 w-1/8 px-2'>{tweet[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-1/3 bg-gray-100 ml-2 rounded-xl shadow-lg flex flex-col items-center justify-center'>
                            <div className='flex'>
                                <p className=''>Tweet Level Prediction</p>
                                <Tooltip title="Percentage of Tweets classified as bot (red) and genuine (green)">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                        <line x1="12" y1="19" x2="12" y2="19.01"></line>
                                    </svg>
                                </Tooltip>
                            </div>
                            <ResponsiveContainer width="100%" height="50%">
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={[
                                            {name: 'Geunuine', value: response.tweet_summary.Total_Genuine},
                                            {name: 'Bots', value: response.tweet_summary.Total_Bots}
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className='flex'>
                                <p className='mr-1'>Final Classification: </p>
                                <p className={` ${response.tweet_summary.Final_Prediction < 0.5? 'text-green-500': 'text-red-500'}`}> <b> {response.tweet_summary.Final_Prediction < 0.5? ' Genuine': ' Bot'}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className='flex mt-12'>
                        <p className='text-3xl font-semibold text-indigo-900 mr-2'>Sequence Level Analysis</p>    
                        <Button variant="outlined" onClick={handleOpenDetails('sequence')}>Details</Button>
                        <Dialog open={openSequence} onClose={handleCloseDetails('sequence')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                            <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Sequence Level Model</DialogTitle>
                            <DialogContent className='bg-gray-100' dividers>
                                <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                    <div>
                                        <p> This Model uses a technique called ‘DNA Compression’.  </p>
                                        <p> Every Twitter user can make three types of status updates which are encoded as:
                                            Tweet (A), Reply (C) and Retweet (T)
                                        </p>
                                        <p> The entire posting history of the account is encoded using these predefined set of letters to generate a DNA Sequence and then compressed to calculate the compression ratio</p>
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'> Lossless Compression Algorithm + Logistic Regression</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='w-2/5 text-base py-3 px-2'>Input Feature</td>
                                                    <td className='w-3/5 text-base font-semibold py-3 px-5'>DNA Sequence of posting history</td>
                                                </tr>                                                
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Basis</td>
                                                    <td className='text-base font-semibold py-3 px-5'> Information Thoery <br /> High Entropy -- Less Compression  Less Entropy -- High Compression</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Parameters</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Original DNA Size vs <br /> Compression Ratio </td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'> Binary Output (0 or 1)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='w-2/5' src={sequence_image} alt = "Not Availble"></img>
                                        </div>
                                        <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Model Architecture</p>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Accuracy: 91.83%</p>
                                        </div>                      

                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDetails('sequence')}>Close</Button>
                            </DialogActions>
                        </Dialog>               
                    </div>
                    <div className='flex mt-1'>
                        <div className='w-2/3 shadow-lg rounded-xl flex flex-col p-3'>
                            <div class='flex mt-2 max-w-full'>
                                <p className='flex text-lg whitespace-nowrap'>DNA Sequence:</p>
                                <p className='text-lg overflow-x-auto ml-2 mr-2 font-bold'> {response.dna_summary.DNA}</p>                           
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Total Tweets: <b> {response.dna_summary.num_tweets} </b></p>
                                <p className='flex-grow'></p>
                                <p className='text-lg'> Encoding <b> A </b></p>
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Total Replies: <b> {response.dna_summary.num_replies} </b></p>
                                <p className='flex-grow'></p>
                                <p className='text-lg'> Encoding <b> C </b></p>
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Total Re-tweets: <b> {response.dna_summary.num_retweets} </b></p>
                                <p className='flex-grow'></p>
                                <p className='text-lg'> Encoding <b> T </b></p>
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Original DNA Length (bytes): <b> {response.dna_summary.original_dna_size} </b></p>
                                <p className='flex-grow'></p>
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Compressed DNA Length (bytes): <b> {response.dna_summary.compressed_dna_size} </b></p>
                                <p className='flex-grow'></p>
                            </div>
                            <div className='flex mt-2'>
                                <p className='text-lg'> Compression Ratio: <b> {(response.dna_summary.compression_ratio).toFixed(2)} </b></p>
                                <p className='flex-grow'></p>
                            </div>
                        </div>
                        <div className='w-1/3 bg-gray-100 ml-2 rounded-xl shadow-lg flex flex-col items-center justify-center'>
                            <div className='flex'>
                                <p className=''>Types of Status Update</p>
                                <Tooltip title="Percent of tweets, retweets and replies by account.">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                        <line x1="12" y1="19" x2="12" y2="19.01"></line>
                                    </svg>
                                </Tooltip>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={[
                                            {name: 'Tweets', value: response.dna_summary.num_tweets},
                                            {name: 'Replies', value: response.dna_summary.num_replies},
                                            {name: 'Re-tweets', value: response.dna_summary.num_retweets}
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_DNA[index % COLORS_DNA.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className='flex mt-2'>
                                <p className=''>Compression Percentage</p>
                                <Tooltip title="A high compression percentage indcates a bot account. The Percentage crossing 100% indicates very high level of predictability">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                        <line x1="12" y1="19" x2="12" y2="19.01"></line>
                                    </svg>
                                </Tooltip>
                            </div>
                            <div className='flex items-center justify-center'>
                                <p className={`text-7xl ${response.dna_summary.Final_Prediction === 0? 'text-green-500': 'text-red-500'}`}>{(response.dna_summary.compressed_dna_size / response.dna_summary.original_dna_size * 100).toFixed(1)}</p>
                                <p className={`text-3xl ${response.dna_summary.Final_Prediction === 0? 'text-green-500': 'text-red-500'}`}>%</p>
                            </div>
                            <div className='flex'>
                                <p className='mr-1'>Final Classification:</p>
                                <p className={` ${response.dna_summary.Final_Prediction === 0? 'text-green-500': 'text-red-500'}`}> <b> {response.dna_summary.Final_Prediction === 0? ' Genuine': ' Bot'}</b></p>
                            </div>
                        </div>
                    </div>                    
                    

                    <div className='flex mt-12'>
                        <p className='text-3xl font-semibold text-indigo-900 mr-2'>Bot Ranking</p>
                        <Button variant="outlined" onClick={handleOpenDetails('ranking')}>Details</Button>
                        <Dialog open={openRanking} onClose={handleCloseDetails('ranking')} scroll={'paper'} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
                            <DialogTitle sx={{ color: 'indigo' , fontSize: 24, m: 2, p: 0 }}  className='text-center text-5xl' id="scroll-dialog-title">Ranking System</DialogTitle>
                            <DialogContent className='bg-gray-100' dividers>
                                <DialogContentText id="scroll-dialog-description" tabIndex={-1} >
                                    <div>
                                    <p> Three different models/ levels of analysis are used to rank accounts:</p>
                                        <ul class='list-disc list-inside bg-rose-200'>
                                            <li>Hate Speech Detection</li>
                                            <li>Malicious Url Detection</li>
                                            <li>Spam Detection</li>
                                        </ul>
                                        <p className='mt-3 text-xl font-bold text-indigo-900' > Hate Speech Detection</p>
                                        <p> The model detects if any tweets of the user contain hate speech </p>
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'>CNN + Bi-GRU</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='w-2/5 text-base py-3 px-2'>Input/ Dataset</td>
                                                    <td className='w-3/5 text-base font-semibold py-3 px-5'>Kaggle Toxic Comment Classification</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Number of Hidden Layers </td>
                                                    <td className='text-base font-semibold py-3 px-5'>7 (6 Layers + Embedding)</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Value between 0 and 1 for each tweet (for 6 different hate classes)</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Optmizer</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Adam Optimizer</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Loss Function</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Binary Cross Entropy</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='h-100 w-3/5' src={hate_image} alt = "Not Availble"></img>
                                        </div>
                                        <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Model Architecture</p>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Accuracy: 93.58%</p>
                                        </div>  
                                        <hr className='mt-5'></hr> 

                                        <p className='mt-5 text-xl font-bold text-indigo-900 ' > Malicious URL Detection</p>
                                        <p> The model detects if any tweets of the user contain Malicious URL </p>    
                                        <p> For each URL found in the tweet, a call to the VirusTotal API is made.</p>                
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'>VirusTotal API Call</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='w-2/5 text-base py-3 px-2'>Input</td>
                                                    <td className='w-3/5 text-base font-semibold py-3 px-5'>URL</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Binary Classification (Malicious / Not Malicious) </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='w-2/5' src={malicious_image} alt = "Not Availble"></img>
                                        </div>
                                        <p className='mt-0 text-medium text-center text-lg text-gray-500 italic'>Model Architecture</p>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'>  Accuracy: N/A</p>
                                        </div>
                                        <hr className='mt-5'></hr> 
                                        <p className='mt-5 text-xl font-bold text-indigo-900' > Spam Detection</p>
                                        <p> The model detects if any tweets of the user contain spam. </p> 
                                        <p> Each tweet is first pro processed to remove stop words and punctuation </p>  
                                        <table className='w-full mt-2 table-auto' style={{maxHeight: '200px', overflowY: 'scroll'}}>
                                            <tbody>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Type</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Multinomial Naive Bayes</td>
                                                </tr>
                                                <tr className='border-b bg-white border-gray-400'>
                                                    <td className='w-2/5 text-base py-3 px-2'>Input Feature</td>
                                                    <td className='w-3/5 text-base font-semibold py-3 px-5'>Td-idf Vector</td>
                                                </tr>
                                                <tr className='border-b bg-gray-200 border-gray-400'>
                                                    <td className='text-base py-3 px-2'>Output</td>
                                                    <td className='text-base font-semibold py-3 px-5'>Value between 0 and 1 for each tweet (spam or ham)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='flex mt-6 mr-2 ml-2 mb-2 place-content-center'>
                                            <img className='w-2/5' src={spam_image} alt = "Not Availble"></img>
                                        </div>
                                        <div className='mt-4 bg-white ml-8 mr-8 rounded-xl shadow-lg flex items-center justify-center'>
                                            <p className='mt-2 mb-2 text-3xl text-indigo-900'> Accuracy: 91.79%</p>
                                        </div>  
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDetails('ranking')}>Close</Button>
                            </DialogActions>
                        </Dialog>                   
                    </div>
                    <div className='flex mt-1'>
                        <div className='w-2/3 flex flex-col'>
                            <div className='w-full shadow-lg rounded-xl flex flex-col p-3'> 
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Total Status Updates: <b> {response.hate_summary.Total_Tweets_Analysed} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> Status with Hate Content: <b> {response.hate_summary.Tweets_with_hate} </b></p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Status with Malicious URL: <b> {response.url_summary.Malicious_Url} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> Status with Spam Content: <b> {response.spam_summary.Tweets_containing_spam} </b></p>
                                </div>
                                <div className='flex mt-2'>
                                    <p className='text-lg'> Clean Status: <b> {goodTweets()} </b></p>
                                    <p className='flex-grow'></p>
                                    <p className='text-lg'> Percent Clean Status Updates: <b> {(goodTweets() / response.hate_summary.Total_Tweets_Analysed * 100).toFixed(1)} % </b></p>
                                </div>
                            </div>
                            <table className='w-full rounded-xl'>
                                <thead className='bg-gray-100 '>
                                    <tr>
                                        <td className='font-bold text-xl w-3/5 p-2'>Tweet</td>
                                        <td className='font-bold text-xl w-1/5 p-2'>Type</td>
                                        <td className='font-bold text-xl w-1/5 p-2'>Estimate</td>
                                    </tr>
                                </thead>
                            </table>
                            {goodTweets() !== response.hate_summary.Total_Tweets_Analysed ? (
                            <table className='w-full block' style={{maxHeight: '300px', overflowY: 'scroll'}}>
                                <tbody>
                                    {response.tweets_with_hate.slice(1, response.tweets_with_hate.length).map(tweet => (
                                        <tr className='border-b border-gray-400'>
                                            <td className='text-lg py-3 w-3/5 px-2'>{tweet[0]}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{'Hate Speech'}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{hateSum(tweet)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tbody>
                                    {response.tweets_with_spam.slice(1, response.tweets_with_spam.length).map(tweet => (
                                        <tr className={`border-b border-gray-400 `}>
                                            <td className='text-lg py-3 w-3/5 px-2'>{tweet[0]}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{'Spam'}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{tweet[1]}</td>
                                        </tr>
                                    )) 
                                    }
                                </tbody>
                                <tbody> 
                                    {response.tweets_with_url.slice(1, response.tweets_with_url.length).map(tweet => (
                                        tweet[1] === "Malicious" ? 
                                        <tr className='border-b border-gray-400'>
                                            <td className='text-lg py-3 w-1/5 px-2'>{tweet[0]}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{"URL"}</td>
                                            <td className='text-lg py-3 w-1/5 px-2'>{tweet[1]}</td>
                                        </tr> : null
                                    )) 
                                    }
                                </tbody>
                            </table>
                            ) : (
                            <div className='w-full shadow-lg rounded-xl flex flex-col p-3'>
                                <h1 className='text-center text-2xl mt-8 mb-16'>No Tweets to Display</h1>
                            </div> )}
                        </div>
                        <div className='w-1/3 bg-gray-100 ml-2 rounded-xl shadow-lg flex flex-col items-center justify-center'>
                            <div className='flex'>
                                <p className=''>Tweet Analysis for Ranking</p>
                                <Tooltip title="Chart showing percentage of tweets with spam, hate and malicious url's">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
                                        <line x1="12" y1="19" x2="12" y2="19.01"></line>
                                    </svg>
                                </Tooltip>
                            </div>
                            <ResponsiveContainer width="100%" height="50%">
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={[
                                            {name: 'Clean', value: goodTweets()},
                                            {name: 'Hate Speech', value: response.hate_summary.Tweets_with_hate},
                                            {name: 'Spam Content', value: response.spam_summary.Tweets_containing_spam},
                                            {name: 'Malicious URL', value: response.url_summary.Malicious_Url}
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_RANK[index % COLORS_RANK.length]} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className='flex'>
                                <p className=''>Rank of Account: </p>
                                <p className={`font-bold ${rankingColors[response.ranking]}`}>{response.ranking}</p>
                            </div>
                            <div className='flex'>
                                <p className=''>Reason: </p> 
                                <p className={`font-bold ${rankingColors[response.ranking]}`}> {RankingReason()} </p>
                            </div>
                        </div>
                    </div>
                </div>
            ): (
                <h1 className='text-center text-2xl mt-12'>No result to display</h1>
            )
        )
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openaboutUs = Boolean(anchorEl);
    const handleClickAboutUs = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAboutUs = () => {
        setAnchorEl(null);
    };
    
    return (
        <React.Fragment>
            <div className='w-full px-5 py-3 shadow-xl bg-black text-white flex'>
                <p className='text-xl flex-grow'> TWITTER BOT DETECTOR AND RANKER </p>
                <p> 
                    <Button size='small' align='left'variant="contained" aria-controls="basic-menu" aria-haspopup="true" 
                        aria-expanded={openaboutUs ? 'true' : undefined} onClick={handleClickAboutUs}> CREATORS
                    </Button>
                </p>
                <Menu id="basic-menu" anchorEl={anchorEl} open={openaboutUs} onClose={handleCloseAboutUs}
                    MenuListProps={{'aria-labelledby': 'basic-button'}} >
                    <MenuItem >Anand Vardhan</MenuItem>
                    <MenuItem >Arsh Goyal</MenuItem>
                    <MenuItem >Shreya Chowdhury</MenuItem>
                    <MenuItem >Sujith K</MenuItem>
                </Menu>
            </div>
            <div className='w-full flex items-center justify-center mt-12'>
                <div className={`p-2 border-b-2 border-${currentTab === 'submit'? 'black': 'white'} mx-2 cursor-pointer`} onClick={_ => setCurrentTab('submit')}>
                    Submit
                </div>
                <div className={`p-2 border-b-2 border-${currentTab === 'result'? 'black': 'white'} mx-2 cursor-pointer`} onClick={_ => setCurrentTab('result')}>
                    Result
                </div>
            </div>
            
            {content}

            {loading && (
                <div className='fixed h-screen w-screen bg-gray-200 bg-opacity-60 top-0 left-0'>
                    <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <CircularProgress />
                    </div>
                </div>
            )}
            <Alert alert={alert} closeAlert={closeAlert}/>
        </React.Fragment>
    )
}

export default Main;