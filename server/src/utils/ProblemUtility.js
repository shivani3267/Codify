import axios from 'axios'

export const getLanguageById =(lang)=>{
    const language={
        'c++':54,
        'java':62,
        "javascript":63
    }
    return language[lang.toLowerCase()];
}

export const submitBatch = async (submissions) => {

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'false'
       },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: { submissions}
    };

    async function fetchData() {
	    try {
		    const response = await axios.request(options);
		    return (response.data);
	    } catch (error) {
		    console.error(error);
	    }
    }

    return await fetchData();//returns array of tokens
}

const waiting = async (timer) => {
    setTimeout(()=>{
        return 1;
    },timer)
}

export const submitToken = async (resultToken) => {

    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    async function fetchData() {
	    try {
		    const response = await axios.request(options);
		    return (response.data);//returns submission array ffor result of each testcase
	    } catch (error) {
		    console.error(error);
	    }
    }

    //keep calling till result is obtained
    while(true){
        const Result = await fetchData();
        const IsReusltObtained = Result.submissions.every((r) => r.status_id>2);
        if(IsReusltObtained) return Result.submissions;

        await waiting(1000)
    }

}