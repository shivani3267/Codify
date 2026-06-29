import axios from 'axios'

axios.post(
  "https://judge0-ce.p.rapidapi.com/submissions?wait=true",
  {
    language_id: 54,
    source_code: '#include<iostream>\nusing namespace std;\nint main(){cout<<"Hello";}'
  },
  {
    headers: {
      "x-rapidapi-key": "7204430a99msh429d38d58e7c526p15c2bcjsn930ca895f5ff",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
    }
  }
).then(r => console.log(r.data))
 .catch(e => console.log(e.response?.data || e.message));