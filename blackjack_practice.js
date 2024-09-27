let Sum_Player = 0;
let Sum_Bank = 0;

while(Sum_Bank < 17)
{
    Sum_Bank += Math.floor(Math.random() * (11 + 1));
    Sum_Player += Math.floor(Math.random() * (11 + 1));

    if(Sum_Player === 21)
    {
        console.log("You Win");
        break;
    }
    
    if(Sumplayer > 21)
    {
        console.log("You Lose");
        break;
    }
}

if(Sum_Player === Sum_Bank)
{
    console.log("Draw");
}
else if(Sum_Bank > 21)
{
    console.log("You Win");
}
else if(Sum_Player > Sum_Bank)
{
    console.log("You Win");
}
else
{
    console.log("You lose");
}