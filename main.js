document.addEventListener('DOMContentLoaded',()=>{



    document.querySelector('.start').addEventListener('click',()=>{
        initialize()
        if(userTurn){
            let initialId = Math.floor(Math.random()*5)*2
            if(Math.random()>0.5){initialId = 0}
            put(1-userTurn,initialId)
        }
    })

    document.querySelector('.first').addEventListener('click',()=>{
        initialize()
        userTurn = 0
    })

    document.querySelector('.second').addEventListener('click',()=>{
        initialize()
        userTurn = 1
        let initialId = Math.floor(Math.random()*5)*2
        if(Math.random()>0.5){initialId = 0}
        put(0,initialId)
    })
    const boardArray = [
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
        {occupiedBy:2},
    ]

    var board = document.querySelector('.board')
    
    
    const Img = ["O.png","X.png"]    
    const strikeMask = [2**0+2**1+2**2,2**3+2**4+2**5,2**6+2**7+2**8,2**0+2**3+2**6,2**1+2**4+2**7,2**2+2**5+2**8,2**0+2**4+2**8,2**2+2**4+2**6]
    const StateWinner = []
    const StateNextMove = []

    var sectors = []
    var boardState = 0
    var userTurn = 0
    var playerChosenState = [0,0]
    var cnt = 0

    function put(turn,id){
        cnt = cnt+1
        boardArray[id].occupiedBy == turn
        sectors[id].setAttribute('src',Img[turn])
        boardState +=(1+turn)*(3**id)
        playerChosenState[turn] += (2**id)   
    }

    function winCheck(x,state){
        let tmp = 2+(x%2==0)+(x==4)
        switch(tmp){
            case 4:
                if((strikeMask[7]&state) == strikeMask[7]){return true}
            case 3:
                
                if((strikeMask[6+(x%4==2)]&state) == strikeMask[6+(x%4==2)]){return true}
            case 2:
                if((strikeMask[x%3+3]&state) == strikeMask[3+x%3] || (strikeMask[Math.floor(x/3)]&state) == strikeMask[Math.floor(x/3)]){return true}
        }
        return false
    }    

    function dfsGameResult(gameState,p1State,p2State,turn){ // if it return 0, it means that when the board state reachs to "gameState" player0 win, if it return 1, player 1 win and if it return 2, nobody can win.
        var flag = false
        var flag2 = true
        for(let i =0; i<9; i++){
            if(Math.floor(gameState/(3**i))%3 == 0){
                flag2 = false
                if(winCheck(i,(1-turn)*(p1State+2**i)+turn*(p2State+2**i))){
                    StateWinner[gameState] = turn
                    StateNextMove[gameState] = i 
                    return turn
                }
                let ret  = dfsGameResult(gameState+(1+turn)*(3**i),p1State+(turn==0)*(2**i),p2State+(turn==1)*(2**i),1-turn)
                if(ret == turn){
                    StateWinner[gameState] = turn
                    StateNextMove[gameState] = i 
                    return turn
                }
                if(ret == 2){
                    StateNextMove[gameState] = i
                    flag = true 
                }
            }
        }
        if(flag || flag2){
            StateWinner[gameState] = 2
            return 2
        }
        StateWinner[gameState] = 1-turn
        return 1-turn
    }

    function preprocessing(){
        for(let i=0; i<3**9; i++){
            StateWinner.push(2)
            StateNextMove.push(-1)
        }
        dfsGameResult(0,0,0,0)
    }



    function selected(){
        let sectorId = this.id
        if(boardArray[sectorId].occupiedBy == 2){
            put(userTurn,sectorId)
            if(winCheck(sectorId,playerChosenState[userTurn])){
                alert("You Win")
                return
            }
            if(cnt == 9){
                alert("Draw")
                return
            }
            if(StateWinner[boardState]!=userTurn){
                let nextMove = StateNextMove[boardState]
                put(1-userTurn,nextMove)
                if(winCheck(nextMove,playerChosenState[1-userTurn])){
                    alert("You Lose!")
                    return
                }
            }
            else{
                console.log("This message should not be shown")
            }

            if(cnt == 9){
                alert("Draw")
                return
            }
        }
    }

    function initialize(){
        boardState = 0
        cnt = 0
        playerChosenState[0] = 0
        playerChosenState[1] = 0
        for(let i =0; i<9; i++){
            boardArray[i].occupiedBy = 2
            sectors[i].setAttribute('src','blank_tic_tae_toe.png')
        }
    }

    function createBoard(){
        boardState = 0
        userTurn = 0
        playerChosenState[0] = 0
        playerChosenState[1] = 0
        for(let i=0; i<9; i++){
            boardArray[i].occupiedBy = 2
            var sector = document.createElement('img')
            sector.setAttribute('src','blank_tic_tae_toe.png')
            sector.setAttribute('id',i)
            sector.addEventListener('click',selected)
            board.appendChild(sector)
            sectors.push(sector)
        }
    }
    createBoard()
    preprocessing()
    
})