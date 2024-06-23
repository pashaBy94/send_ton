import "@stdlib/deploy";

message  Withdraw{
    amount: Int as uint32;
}

contract SendTon with Deployable {
    const minSafeSumm: Int = ton("0.01");
    owner: Address;
    
    init() {
        self.owner = sender();
    }
    fun onlyOwner(){
        require(sender() == self.owner, "only owner can withdraw");
    }
    
    receive(){

    }
    receive("withdraw all"){
        self.onlyOwner();
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: true,
            mode: SendRemainingBalance + SendIgnoreErrors,
            body: "This is your many".asComment()
        });
    }
    receive("withdraw safe"){
        self.onlyOwner();
        send(SendParameters{
            to: sender(),
            value: myBalance() - context().value - self.minSafeSumm,
            mode: SendIgnoreErrors + SendRemainingValue,
            body: "This is your many".asComment()
        });
    }
    receive(msg: Withdraw){
        self.onlyOwner();
        require(myBalance() - self.minSafeSumm - context().value >= msg.amount, "do not have many");
        send(SendParameters{
            to: sender(),
            value:  msg.amount,
            mode: SendIgnoreErrors + SendRemainingValue,
            body: "This is your many".asComment()
        });
    }
    get fun balance(): String{
        return myBalance().toCoinsString();
    }
}
