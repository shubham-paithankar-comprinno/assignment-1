//Variables 
const LAPTOPS_URI = `https://noroff-komputer-store-api.herokuapp.com/computers`

//Booleans
let loanTaken = Boolean(false)
let computerBought = Boolean(false)

//Doms Objects
const balance = document.getElementById("balance")
const loanButton = document.getElementById("loan-btn")
const outstandingLoanElement = document.getElementById("outstanding-loan-element")
const outstandingLoan = document.getElementById("outstanding-loan")
const workSection = document.getElementById("work")
const bankButton = document.getElementById("bank-btn")
const workButton = document.getElementById("work-btn")
const payAmount = document.getElementById("pay-amount")
const buttonGroup = document.getElementById("button-group")
const laptopDropdown = document.getElementById("laptop-dropdown")
const featuresElement = document.getElementById("features-element")
const features = document.getElementById("features")
const laptopElement = document.getElementById("laptop-element")
const laptopName = document.getElementById("laptop-name")
const laptopDescription = document.getElementById("laptop-description")
const laptopPrice = document.getElementById("laptop-price")
const buyNowButton = document.getElementById("buy-now-btn")

//Repay Button
const repayButton = document.createElement("BUTTON")
const textNode = document.createTextNode("Repay")
repayButton.setAttribute("class", "btn mx-2")
repayButton.setAttribute("id", "repay-btn")
repayButton.appendChild(textNode)

//Dropdown
const defaultOption = document.createElement("OPTION")
const defaultOptionName = document.createTextNode("Choose a laptop")
defaultOption.appendChild(defaultOptionName)
laptopDropdown.appendChild(defaultOption)

//Dom Objects properties
outstandingLoanElement.style.display = 'none'
featuresElement.style.display = 'none'
laptopElement.style.display = 'none'

//Functions
const addRepayButton = () => {
    buttonGroup.appendChild(repayButton)
}

const removeRepayButton = () => {
    buttonGroup.removeChild(repayButton)
}

const addWorkMoney = () => {
    //Add 100 money on each click
    payAmount.innerHTML = parseInt(payAmount.innerHTML) + 100

}

const getLoan = () => { //function to get a loan

    //If loan is taken you cannot take another loan before you buy a computer
    if (loanTaken === true && computerBought === false) {
        alert(`You have to buy a computer first before getting any more loan.`)
        return
    }

    //Get loan amount
    var loanAmount =  prompt(`Enter the amount you like to borrow: \n(Loan amount should not be greater than double your current bank balance)`)

    if (loanAmount === null) return

    if (isNaN(loanAmount)) {
        alert(`Please enter a value between 1 to ${parseInt(balance.innerHTML) * 2}`)
        return
    }

    //check if loan is x2 balance
    if (loanAmount > parseInt(balance.innerHTML) * 2) {
        alert(`Loan amount should not be greater than double your current bank balance!`) 
        return
    }

    //Set loan taken to true
    loanTaken = Boolean(true)

    //Add repay button, display loan amount and set computer bought to false after taking a loan
    if (loanTaken) {
        outstandingLoanElement.style.display = 'block'

        //If laptop is bought and loan is not paid, add new loan to old loan
        outstandingLoan.innerHTML ? 
        (
            outstandingLoan.innerHTML = parseInt(loanAmount) + parseInt(outstandingLoan.innerHTML)
        ) : (
            outstandingLoan.innerHTML = loanAmount
        ) 

        //Add loan to bank balance, add repay button and set computer bought to false
        balance.innerHTML = parseInt(balance.innerHTML) + parseInt(loanAmount)   
        
        addRepayButton()

        computerBought = Boolean(false)
    } 

}

//function to transfer money to bank from work
const transferMoney = () => {

    if (parseInt(payAmount.innerHTML)  === 0) return

    let deductedAmount

    if (loanTaken === true) {

        // 10% of work payroll when loan is taken
        deductedAmount = Math.floor(10 * parseInt(payAmount.innerHTML) / 100)

        //Transfer that 10% to loan to be subtracted
        outstandingLoan.innerHTML = parseInt(outstandingLoan.innerHTML) - deductedAmount

        //If loan reaches 0 set loanTaken to false
        if (parseInt(outstandingLoan.innerHTML) <= 0) {

            outstandingLoan.innerHTML = "0"

            outstandingLoanElement.style.display = "none"

            loanTaken = Boolean(false)

            removeRepayButton()

        }

    }

    // If amount is deducted, subtract the amount from total bank balance
    deductedAmount ? 
    (
        balance.innerHTML = parseInt(balance.innerHTML) + parseInt(payAmount.innerHTML) - deductedAmount
    ) : (
        balance.innerHTML = parseInt(balance.innerHTML) + parseInt(payAmount.innerHTML)  
    )

    //Set pay to 0
    payAmount.innerHTML = "0"

}

const clearLoan = () => {

    // If loan is greater than payroll, send all amount to loan
    if (parseInt(outstandingLoan.innerHTML) >= parseInt(payAmount.innerHTML)) {

        outstandingLoan.innerHTML = parseInt(outstandingLoan.innerHTML) - parseInt(payAmount.innerHTML)

        payAmount.innerHTML = "0"

    }
    // If loan is less than payroll, clear all loan
    else if (parseInt(payAmount.innerHTML) >= parseInt(outstandingLoan.innerHTML)) {

        payAmount.innerHTML = parseInt(payAmount.innerHTML) - parseInt(outstandingLoan.innerHTML)

        outstandingLoan.innerHTML = "0"
    }

    //If loan reaches 0 set loanTaken to false
    if (parseInt(outstandingLoan.innerHTML) <= 0) {

        outstandingLoan.innerHTML = "0"

        outstandingLoanElement.style.display = "none"

        loanTaken = Boolean(false)

        removeRepayButton()
    }

}

//Function to buy laptop
const buyLaptop = () => {
    if (laptopPrice.innerHTML === "") return

    //If balance is lower than laptop price
    if (parseInt(laptopPrice.innerHTML) > parseInt(balance.innerHTML)) {
        alert(`You dont have enough bank balance.`)
        return
    }

    balance.innerHTML = parseInt(balance.innerHTML) - parseInt(laptopPrice.innerHTML)

    alert(`Thank you for purchasing ${laptopName.innerHTML}!`)

    computerBought = Boolean(true)
    
}

//Event Listeners
loanButton.addEventListener("click", getLoan)
workButton.addEventListener("click", addWorkMoney)
bankButton.addEventListener("click", transferMoney)
repayButton.addEventListener("click", clearLoan)
buyNowButton.addEventListener("click", buyLaptop)

defaultOption.addEventListener("click", () => {
    document.getElementById("laptop-select").style.display = 'block'
    featuresElement.style.display = 'none'
    laptopElement.style.display = 'none'
})


//Fetch laptop data and attach objects to dropdown and laptop info
fetch(LAPTOPS_URI).then(res => res.json()).then(data => {
    data.forEach(laptop => {
        //Add each laptop as an option to select dropdown
        const option = document.createElement("OPTION")
        const textNode = document.createTextNode(laptop.title)
        option.appendChild(textNode)
        laptopDropdown.appendChild(option)

        //On option select change laptop info
        option.addEventListener("click", () => {
            document.getElementById("laptop-select").style.display = 'none'

            featuresElement.style.display = 'block'
            // features.innerHTML = laptop.specs.join(`; `)

            if (features.innerHTML) features.innerHTML = ""

            laptop.specs.forEach(e => {
                const feature = document.createElement("LI")
                const textNode = document.createTextNode(e)
                feature.setAttribute("class", "m-1")
                feature.appendChild(textNode)

                features.appendChild(feature)
            })

            laptopElement.style.display = 'block'
            laptopName.innerHTML = laptop.title
            laptopDescription.innerHTML = laptop.description
            laptopPrice.innerHTML = laptop.price
        })
    })
}).catch(e => {
    console.log(e.message)
})