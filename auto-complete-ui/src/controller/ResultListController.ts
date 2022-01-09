import config from '../../data/config'
interface IResultController {
    answerArr: Array<string>,
    root: Element,
    currentChunk: number,
    answerArrLength: number,
    isRequestNotEmpty: boolean,
    renderList(): void,
}

class ResultController implements IResultController {
    root: Element;
    answerArr: Array<string>;
    chunksArr: string[][];
    currentChunk: number;
    answerArrLength: number;
    isRequestNotEmpty: boolean;

    constructor(answerArr: Array<string>, root: Element, answerArrLength: number, isRequestNotEmpty: boolean) {
        this.root = root
        this.answerArr = answerArr;
        this.currentChunk = 0;
        this.answerArrLength = answerArrLength;
        this.isRequestNotEmpty = isRequestNotEmpty
        this.chunksArr = this.getChunks(this.answerArr);
    }

    public renderList(numberOfChunk: number = this.currentChunk): void {
        if (this.chunksArr.length && this.chunksArr[numberOfChunk] !== undefined) {
            const listWrapper: DocumentFragment = document.createDocumentFragment()
            this.chunksArr[numberOfChunk].forEach((elem) => {
                const el = document.createElement('div')
                el.classList.add('element')
                el.innerText = elem
                listWrapper.appendChild(el)
            })
            this.root.appendChild(listWrapper)
        } else {
            const el = document.createElement('div')
            const innerText: string = !this.isRequestNotEmpty ? config.inputFieldIsEmpty : this.answerArrLength == 0 ? config.nothingFound : config.thatsAll
            el.classList.add('system-message')
            el.innerText = innerText
            this.root.appendChild(el)
        }
    }

    private getChunks(arr: Array<string>): string[][] {
        const chunkCounter = Math.ceil(arr.length / config.CHUNK_SIZE)
        const chunksArr: string[][] = new Array(chunkCounter)
        let [counter, counter2]: [number, number] = [0, 0]

        for (let i = 0; i < chunksArr.length; i++) {
            chunksArr[i] = new Array(0);
        }

        arr.forEach((el) => {
            if (counter2 == config.CHUNK_SIZE) {
                counter2 = 0
                counter = counter + 1
            }
            chunksArr[counter].push(el)
            counter2 = counter2 + 1
        })
        return chunksArr
    }

    public setObserver(element: Element = this.root): void {
        const options: IntersectionObserverInit = {}
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (this.chunksArr.length > this.currentChunk) {
                        this.currentChunk = this.currentChunk + 1
                        this.renderList()
                    }
                } else {
                    return
                }
                observer.unobserve(entry.target)
                if (element.lastElementChild) {
                    if (!element.lastElementChild.classList.contains('system-message')) {
                        observer.observe(element.lastElementChild)
                    }
                }
            })
        }, options)
        if (element.lastElementChild) {
            observer.observe(element.lastElementChild)
        }
    }
}

export default ResultController