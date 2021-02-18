import spec from './call_list_spec.js'



var app = new Vue({
    el: '#app',
    data: {
        reqData : {
            first: {
                json: {mssg: "bla1"}
            },
            second: {
                json: {mssg: "bla2"}
            },
            third: {
                json: {mssg: "bla3"}
            },
        },
        spec: {},
        specList: {},
        generator: null,
        btnDisabled: true,
        selectedData: null,
        initialized: false,
    }, 
    created: () => {
        console.log('created')
    },
    methods: {
        initEndToEnd() {
            this.specList = spec.calls
            this.initialized = true
            this.generator = this.generateAjaxCalls(this.specList)
            this.prepareNextCall()
        },
        async generatorLoop() {
            for await (let promise of this.generator) {
                console.log(promise)
                // this.nextCall()
            } 
        },
        execCall() {
            this.btnDisabled = true
            let testDataIndex = this.spec.name
            let reqData = this.reqData
            let selectedData = reqData[testDataIndex].json
            this.generator.next(selectedData).then(obj => {
                console.log('execCall', obj)
                
                this.prepareNextCall()
                
            })
        },
        prepareNextCall() {
            this.generator.next().then(obj=>{
                console.log('prepareNextCall', obj)
                if (obj.value && !obj.done) {
                    this.spec = obj.value
                    this.btnDisabled = false
                } else {
                    console.log('reached the end of the chain')
                }
            })
        },
        async *generateAjaxCalls(uris) {
            let request
        
            for (let obj of uris) {
                request = yield obj
                yield this.makeAjaxCall(request, obj.uri);
            }
          },
        makeAjaxCall(data, uri) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest
                xhr.open('POST', uri)
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        resolve(xhr.responseText)
                    }
                }
                xhr.send()
            });
        }
    }
})
