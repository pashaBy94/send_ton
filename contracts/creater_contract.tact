import "@stdlib/deploy";

message SendAddress {
    addressId: Int as uint64;
}

contract CreaterContract with Deployable {
    i1: Int as uint32;

    init() {
        self.i1 = 22;
    }
    get fun address(): Address{
        return myAddress();
    }
    get fun anOtherAddress(): Address{
        let state: StateInit = initOf CreaterContract2();
        return contractAddress(state);
    }
}

contract CreaterContract2 with Deployable {
    i1: Int as uint32;

    init() {
        self.i1 = 22;
    }

    get fun address(): Address{
        return myAddress();
    }
    get fun anOtherAddress(): Address{
        let state: StateInit = initOf CreaterContract();
        return contractAddress(state);
    }
}

contract CreaterCont with Deployable {
    id: Int as uint64;

    init(id: Int) {
        self.id = id;
    }
    
    get fun address(): Address{
        return myAddress();
    }
    get fun anOtherAddress(id: Int): Address{
        let state: StateInit = initOf CreaterCont(id);
        return contractAddress(state);
    }
    receive(msg: SendAddress){
        let state: StateInit = initOf CreaterCont(msg.addressId);
        let address: Address = contractAddress(state);
        send(SendParameters{
            to: address,
            value: 0,
            mode: SendIgnoreErrors + SendRemainingValue,
            bounce: true,
            code: state.code,
            data: state.data,
            body: Deploy{queryId: 0}.toCell()
        });
    }
}