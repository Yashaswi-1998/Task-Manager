const calculateTip=(total,tipPercent= .25)=>{
    const tip=total * tipPercent
    return total+tip
}

const add= (a,b)=>{

    return  new Promise((resolve ,reject)=>{
        setTimeout(()=>{
          resolve(a+b)  
        },2000)
    })


}

module.exports={
    calculateTip,
    add
}