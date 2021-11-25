#!/usr/bin/env node
const redis = require("redis")
const { millify } = require("millify")

const client = redis.createClient()

client.on("error", function (error) {
    console.error(error)
})


setInterval(() => {
    client.DBSIZE((reply, size) => {
        console.clear()
        client.INFO('MEMORY', (op1, op2) => {
            const memInfo = {}
            op2.split('\r\n').map(str => {
                const pair = str.split(':')
                if (pair[0] && pair[1])
                    memInfo[pair[0]] = pair[1]
            })

            const usedMemory = memInfo['used_memory']
            const usedMemoryHuman = memInfo['used_memory_human']
            const maxMemory = memInfo['maxmemory']
            const maxMemoryhuman = memInfo['maxmemory_human']
            console.log(`${millify(size)} Keys Created! (${size})\nUsed: ${usedMemoryHuman}\nAvailable: ${maxMemoryhuman}\nUsage: ${Math.round((usedMemory / maxMemory) * 100)}%`)
        })
    })
}, 1e3)