document.addEventListener('DOMContentLoaded',()=>{
	const grid = document.querySelector('.grid')
  const count = document.querySelector(".count")
  const modal =  document.querySelector(".modal")
  const lostWin = document.querySelector(".lost-or-win")
  const alertBox = document.querySelector(".alert")
	let width = 10;
	let bombAmount = 20;
	let squares = [];
	let isGameOver = false;
	let flags=0;
    
    document.querySelector(".close-btn").onclick = function(){
          setDisplay()
    } 
    document.querySelector(".try-btn").onclick = function(){
          reloadPage()
    } 
    document.querySelector(".play-btn").onclick = function(){
          reloadPage()
    } 
    //create board
    function createBoard(){
    	//get shuffled arrays with random bombs
    	const bombArray = Array(bombAmount).fill('bomb');
    	const emptyArray = Array(width*width-bombAmount).fill('valid');
    	const gameArray = emptyArray.concat(bombArray);
    	const shuffledArray = gameArray.sort(()=> Math.random()-0.5);
    	for(let i=0; i<width*width; i++){
    		const square = document.createElement('div');
    		square.setAttribute('id',i);
    		square.classList.add(shuffledArray[i]);
    		grid.appendChild(square);
    		squares.push(square);
    		//normal click
    		square.addEventListener('click',function(e){
    			click(square)
    		})
    		//control and left click
    		square.oncontextmenu = function(e){
    			e.preventDefault()
    			addFlag(square)
    		}
   	}
    	//add Numbers
    	for(let i=0; i<squares.length; i++){
    		let total=0;
    		const isLeftEdge = (i%width === 0)
    		const isRightEdge = (i%width === width-1)
    	 if (squares[i].classList.contains('valid')){
    		 if(i>0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++
       if(i>9 && !isRightEdge && squares[i+1-width].classList.contains('bomb')) total++
       if(i>10 && squares[i-width].classList.contains('bomb')) total++
       if(i>11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++
       if(i<98 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
       if(i<90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++
       if(i<88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++
       if(i<89 && squares[i+width].classList.contains('bomb')) total++	
      
      squares[i].setAttribute('data',total)
     
    	}
    }
   }

    createBoard();
    
   //add flag with rightclick
   
   function addFlag(square){
    console.log("get flag")
   	if(isGameOver) return
   	if(!square.classList.contains('checked')&&(flags<bombAmount)){
   	 if(!square.classList.contains('flag')){
   		square.classList.add('flag')
   		square.innerHTML = `<i class="fas fa-flag flag-icon"></i>`
   		flags++
      count.innerHTML = 20-flags
   		checkForWin()
   	 }else{
   		square.classList.remove('flag')
   		square.innerHTML = ''
   		flags--
      count.innerHTML = 20-flags
   		 	}

       }
       else{
           if(flags==bombAmount){
           square.classList.remove('flag')
           square.innerHTML = ''
           flags--
           count.innerHTML = 20-flags
         }
       }
     
   }


    function click(square){
      console.log("clicked")
    	if (isGameOver) return;
    	if(square.classList.contains('checked')||square.classList.contains('flag')) return
    	if(square.classList.contains('bomb')){
        gameOver()
    	}else{
    		let total = square.getAttribute('data');
    		if(total!=0){
    			square.classList.add('checked')
    			square.innerHTML = total;
    			return;

    		}
    		checkSquare(square, square.id)
  
    		// square.classList.add('checked');
    	}

        square.classList.add('checked');
   }

//check neighbouring once square is clicked
function checkSquare(square, currentId){
	const isLeftEdge = (currentId%width === 0)
	const isRightEdge = (currentId%width === width-1)
	setTimeout(()=>{
		if(currentId > 0 && !isLeftEdge){
			const newId = squares[parseInt(currentId)-1].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if(currentId>9 && !isRightEdge){
			const newId = squares[parseInt(currentId)+1-width].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId>10){
			const newId = squares[parseInt(currentId-width)].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId>11 && !isLeftEdge){
			const newId = squares[parseInt(currentId)-1-width].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId<98 && !isRightEdge){
			const newId = squares[parseInt(currentId)+1].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId<90 && !isLeftEdge){
			const newId = squares[parseInt(currentId)-1+width].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId<88 && !isRightEdge){
			const newId = squares[parseInt(currentId)+1+width].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}
		if(currentId<89 && !isLeftEdge){
			const newId = squares[parseInt(currentId)+width].id
			const newSquare = document.getElementById(newId)
		 click(newSquare)
		}

	},10)
}

//GAME OVER

//1F4A3   26F3
function gameOver(square){
	
	isGameOver = true
  alertBox.style.display = "block"
	//show ALL bombs
  setTimeout(function(){
     squares.forEach(square=>{
    if(square.classList.contains('bomb')){

      square.innerHTML = `<i class="fas fa-bomb"></i>`
     
        square.classList.add("bomb-red-effect");
    

    }
    // square.classList.add("bomb-red-effect");
  })
  },1000)
	
  setTimeout(function(){ 
    winAndLose("You Lose!") 
    alertBox.style.display = "none";
  }, 2000);
 
}
//check for win
function checkForWin(){
	let matches=0
	for (let i=0; i<squares.length; i++){
		if(squares[i].classList.contains('flag')&&squares[i].classList.contains('bomb')){
			matches++
		}
		if(matches === bombAmount){
			isGameOver =  true


       setTimeout(function(){ winAndLose("You Won!") }, 1000); ;
		}
	}
}
//changing display on close and tryagain
function setDisplay(){
    console.log("chaange display")
    modal.style.display = "None"
   }
function reloadPage(){
    console.log("reload")
    window.location.reload()
   }

function winAndLose(i){
  lostWin.innerHTML = i
  modal.style.display = "block"
}
})