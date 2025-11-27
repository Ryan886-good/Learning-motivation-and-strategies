const answer=[];
let NormsTable = {};
const original_scores_cache = {};

//開始頁面//
const start_page=document.querySelector("#start_page");
const start_button=document.querySelector("#start_button");
const questions_page=document.querySelector("#questions_page");
start_button.addEventListener("click",()=>{
    start_page.hidden=true;
    questions_page.hidden=false;
    fetch("title.json")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        loadQuestions(data);
        return fetch("percentile.json");
    })
    .then(function(response){
    return response.json();
    })
    .then(function(data){
        NormsTable = data;
    });

});
//開始頁面//


//查看結果
const result_button=document.querySelector("#view_score_button");
const warning=document.querySelector("#warning");
result_button.addEventListener("click",()=>{
    const warning_text=document.querySelector("#warning_text");
    let status=true;
    const missing=[];
    for(var i=1;i<88;i++){
        if(!answer[i]){
            missing.push(i);
            status=false;
        };
    };
    if(!status){
        const formattedMissing = Cut(missing, 10);
        warning_text.innerText=`第${formattedMissing}題未填寫`;
        warning.hidden=false;
    }else{
        warning.hidden=true;
        questions_page.hidden=true;
        result_page.hidden=false;
        calculate();
        calculatePercentiles()

    }

});
//查看結果

//計算並顯示//
const scale=[
    {
        name: "態度",
        number: [13,16,34,40,46,64,81],
        reverse: [13,16,34,40,46,64,81],
    },
    {
        name:"動機",
        number:[9,12,26,30,37,44,51],
        reverse:[30,44]
    },
    {
        name:"時間管理",
        number:[3,20,32,38,43,53,61,68,87],
        reverse:[3,20,32,38,61,68]
    },
    {
        name:"焦慮",
        number:[1,8,23,28,49,52,58,82],
        reverse:[1,8,23,28,49,52,58,82]
    },
    {
        name:"專心",
        number:[5,10,35,39,41,50,56,63],
        reverse:[5,10,35,39,41,50,56,63]
    },
    {
        name:"訊息處理",
        number:[11,14,21,29,36,42,62,70,83],
        reverse:[]
    },
    {
        name:"選擇要點術",
        number:[2,7,55,67,71,84],
        reverse:[55,67,71]
    },
    {
        name:"學習輔助",
        number:[6,17,22,45,48,57,85],
        reverse:[]
    },
    {
        name:"自我測驗",
        number:[4,15,19,24,27,33,60,65,86],
        reverse:[]
    },
    {
        name:"考試策略",
        number:[18,25,31,47,54,59,66,69],
        reverse:[18,25,31,47,54,59,66,69]
    },
    {
        name:"解決學習困難策略",
        number:[72,73,74,75,76,77,78,79,80],
        reverse:[72]
    },
]

function reverse(score){
    return 6-score;
};

function calculate(){
    const original_score=document.querySelectorAll(".original_score");

    original_score.forEach((item,index)=>{
        let sum=0;
        for(var i=0;i<scale[index].number.length;i++){
            if(scale[index].reverse.includes(scale[index].number[i])){
                sum+=reverse(answer[scale[index].number[i]]);
            }else{
                sum+=answer[scale[index].number[i]];
            };
        };
        item.innerText=sum;
        original_scores_cache[scale[index].name] = sum;
    });
}
//計算並顯示//
//拿到percentile data//
function getPercentileRank(rawScore, dimension) {
    const normData = NormsTable[dimension];

    if (!normData || normData.length === 0) return 0;
    const sortedNorms = [...normData].sort((a, b) => b.raw - a.raw);
    for (const entry of normData) {
        if (rawScore >= entry.raw) {
            return entry.percentile;
        }
    }

    return 1;
}
function calculatePercentiles() {
    const percentile=document.querySelectorAll(".percentile");

    percentile.forEach((item, index) => {
        const dimensionName = scale[index].name;
        const rawScore = original_scores_cache[scale[index].name];

        if (rawScore !== undefined) {
            const pRank = getPercentileRank(rawScore, dimensionName);
            item.innerText = pRank;
        } else {
            item.innerText = "N/A";
        }
    });
}
//填入資料//






//問題卡片重複//
function loadQuestions(data){
    const template=document.querySelector("#question_template");
    const container=document.querySelector("#questions_container");
   
    data.forEach((item)=>{
        const clone=template.content.cloneNode(true);
        clone.querySelector("#question_title").textContent=`${item.id}.${item.title}`;
        clone.querySelectorAll("input[type='radio']").forEach(function(i){
            i.name=`option_${item.id}`;
            i.addEventListener("change",()=>{
                answer[item.id]=Number(i.value);
            });
        });
        container.appendChild(clone);
    });
}
//問題卡片重複//

//列表切片//
function Cut(items,num){
    let result='';
    for(var i=0;i<items.length;i+=num){
        result+=items.slice(i,i+num).join(",");
        if(i+num<items.length){
            result+='\n';
        }
    }
    return result;
}
//列表切片//

//預先拿掉檢查機制//
/*const warning_text=document.querySelector("#warning_text");
    let status=true;
    const missing=[];
    for(var i=1;i<88;i++){
        if(!answer[i]){
            missing.push(i);
            status=false;
        };
    };
    if(!status){
        const formattedMissing = Cut(missing, 10);
        warning_text.innerText=`第${formattedMissing}題未填寫`;
        warning.hidden=false;
    }else{
        questions_page.hidden=true;
        result_page.hidden=false;
        calculate();
    }*/