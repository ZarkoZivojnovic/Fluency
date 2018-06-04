function createConversationKey(myUsername, otherUsername) {
    let temp = [myUsername, otherUsername].sort();
    return temp[0] + temp[1];
}

//                      ########## baza konverzacija ##########
let msgsBase = {
    conversations: {
        generisaniKljuc1: [
            {
                messageBody: "blalalala",
                senderUsername: "milos",
                receiverUsername: "zarko",
                date: 2018 - 6 - 3,
                seen: true
            },
            {
                messageBody: "blalalala",
                senderUsername: "zarko",
                receiverUsername: "milos",
                date: 2018 - 6 - 3,
                seen: false
            }
        ],
        generisaniKljuc2: [],
        generisaniKljuc3: [],
        generisaniKljuc4: []
    },
    newMsgs: {
        user1: true,
        user2: false,
        user3: false,
        user4: true,
        user5: true,
        user6: true,
        user7: false
    }
};
