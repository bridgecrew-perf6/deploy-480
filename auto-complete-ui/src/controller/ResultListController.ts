interface IResultController {
    answerArr: Array<string>,
    root: Element,
    currentChunk: number,
    renderList(): void,
}

class ResultController implements IResultController {
    root: Element;
    answerArr: Array<string>;
    chunksArr: string[][];
    currentChunk: number;

    constructor(answerArr: Array<string>, root: Element) {
        this.root = root
        this.answerArr = answerArr;
        this.chunksArr = this.getChunks(this.answerArr);
        this.currentChunk = 0
    }

    readonly CHUNK_SIZE: number = 20;

    public renderList(): void {
        const listWrapper: DocumentFragment = document.createDocumentFragment()
        this.chunksArr[this.currentChunk].forEach((elem) => {
            const el = document.createElement('div')
            el.classList.add('element')
            el.innerText = elem
            listWrapper.appendChild(el)
        })
        this.root.appendChild(listWrapper)
    }

    private getChunks(arr: Array<string>): string[][] {
        const chunkCounter = Math.ceil(arr.length / this.CHUNK_SIZE)
        const chunksArr: string[][] = new Array(chunkCounter)
        let [counter, counter2]: [number, number] = [0, 0]
        for (let i = 0; i < chunksArr.length; i++) {
            chunksArr[i] = new Array(0);
        }
        arr.forEach((el) => {
            if (counter2 == this.CHUNK_SIZE) {
                counter2 = 0
                counter = counter + 1
            }
            chunksArr[counter].push(el)
            counter2 = counter2 + 1
        })
        return chunksArr
    }

    public setObserver(element: Element = this.root): void {
        const observer: IntersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.renderList()
                }
                observer.unobserve(entry.target)
                if (element.lastElementChild) {
                    observer.observe(element.lastElementChild)
                }
            })
        }, {
            threshold: 1
        })
        if (element.lastElementChild) {
            observer.observe(element.lastElementChild)
        }
    }
}

export default ResultController