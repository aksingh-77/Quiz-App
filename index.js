const URL = "https://opentdb.com/api.php?amount=10&category=9&type=multiple";

const questionParent = document.querySelector(".questions-container");
const optionsParent = document.querySelector(".option-container");
const nextButton = document.querySelector(".next");
const quitBtn = document.querySelector(".quit");
const quizCategry = document.querySelector(".quiz-category");
const qnsCount = document.querySelector(".qns-count");
const curScore = document.querySelector(".cur-score");
const rules = document.querySelector(".rule-book");
const quizBook = document.querySelector(".quiz");
const playBtn = document.querySelector(".play-btn");
const result = document.querySelector(".result");

let quizzes = [];
let currentQuestionIndex = 0;
let score = 0;


//====================================Method on click of play button event listner===========================================//
playBtn.addEventListener("click", ()=>{
    quizBook.classList.remove("hide");
    rules.classList.add("hide");
});
//=============================================================================================================================//



//=============================Fetching the Data from the API -=========================================================//
const getData = async (url) => {
    try{
        //just destructured the response object and fetched the results from data objects
        const { data : {results} } = await axios.get(url);
        return results;
    }catch(err){
        console.log("The Error while getData ",err)
    }
};

const getQuizzes = async () => {
    quizzes = await getData(URL);
    // console.log(quizzes);
}

getQuizzes();
//=============================================================================================================================//




//===============================================Method to create the questions and Answer------==========================================//
function createQuestionsAndOption(quizzes, index){
    quizCategry.innerText = quizzes[index].category;
    curScore.innerText = `Score ${score}`;
    qnsCount.innerText = `Q${index+1}/${quizzes.length}`;


    const questionElement = document.createElement("p");
    questionElement.innerText =`Q${currentQuestionIndex + 1}: ${quizzes[index].question}`;
    questionParent.appendChild(questionElement);
    
    // console.log(quizzes);

     //as we are getting the array of options as 1 correct answer and 3 incorrect,
    //we have to get them in one single array and sort the array in random manner.
    let options = [
        quizzes[index].correct_answer, 
        ...quizzes[index].incorrect_answers
    ].sort(() => Math.random()-0.5);

    

    for(let option of options){
        
        const optionBtn = document.createElement("button");
        optionBtn.classList.add("button");
        optionBtn.setAttribute("name",option);
        optionBtn.innerText = option;
        optionsParent.appendChild(optionBtn);
    }

    
    // console.log(options);
}
//=============================================================================================================================//




//=============================================Click event of options=========================================================//

function disabledOption(){
    document.querySelectorAll(".button").forEach((button) => {button.disabled = true});
}

optionsParent.addEventListener("click", (event)=> {


    if(event.target.name === quizzes[currentQuestionIndex].correct_answer){
        event.target.classList.add("success");
        score++;
        curScore.innerText = `Score: ${score}`;
        disabledOption();
        
    }else if(event.target.name !== quizzes[currentQuestionIndex].correct_answer){
        event.target.classList.add("error");
        disabledOption();
    }
});
//=============================================================================================================================//



//========================================Next/Submit Button click event=================================================//
nextButton.addEventListener("click", () => {
    
    if(nextButton.innerText == "Next"){
        currentQuestionIndex ++;
        questionParent.innerHTML = "";
        optionsParent.innerHTML = "";
        if(currentQuestionIndex === 9){
            nextButton.innerText = "Submit";
        }
        createQuestionsAndOption(quizzes, currentQuestionIndex);
        
    }
    if(nextButton.innerHTML === "Submit"){
        quizBook.classList.add("hide");
        result.innerText = `Your Score : ${score}`;
        result.classList.remove("hide");
    }

});
//=============================================================================================================================//


//=====================================Quit Button action method===============================================================//

quitBtn.addEventListener("click", ()=> {
    currentQuestionIndex = 0;
    questionParent.innerText = "";
    optionsParent.innerText = "";
    score = 0;
    createQuestionsAndOption(quizzes, currentQuestionIndex);
    rules.classList.remove("hide");
    quizBook.classList.add("hide");
});
//=============================================================================================================================//




setTimeout(() => createQuestionsAndOption(quizzes, currentQuestionIndex), 2000);
