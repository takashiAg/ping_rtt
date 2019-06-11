let ping = require("net-ping");
let fs = require("fs");

let session = ping.createSession();

let target = "8.8.8.8";

let filename = "rtt.csv"


let RTT = function (host) {
    return new Promise((resolve, reject) => {
        let startTime = Date.now();
        session.pingHost(target, function (error, target) {
            let endTime = Date.now();
            if (error)
                reject(error)
            else
                resolve(endTime - startTime)
        });

    })
}

let wait = time => new Promise((resolve, reject) => {
    setTimeout(resolve, time * 1000);
})

let exportCSV = (unixtime, rtt) => new Promise((resolve, reject) => {
    fs.appendFile(filename, unixtime + "," + rtt + "\n", (err, data) => {
        if (err)
            reject(err);
        else
            resolve()
    });

})
let main = async () => {
    while (true) {
        let rtt
        try {
            rtt = await RTT("8.8.8.8")
            await exportCSV(Date.now(), rtt)
        } catch (e) {
            console.log(e)
        }
        // console.log(rtt)
        await wait(1)
    }
}


main()