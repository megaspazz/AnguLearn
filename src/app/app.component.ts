import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, combineLatest, combineLatestWith, count, every, filter, firstValueFrom, from, groupBy, identity, of, last, map, mergeAll, mergeMap, reduce, sequenceEqual, takeLast, tap, toArray, windowCount, zip } from 'rxjs';
import { transpile } from 'typescript';

import * as rxjsAlias from 'rxjs';

// import { CodeMirror } from '@codemirror';
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from 'codemirror';
import { indentWithTab } from "@codemirror/commands";
import { javascript } from '@codemirror/lang-javascript';
import { UnaryOperator } from '@angular/compiler';
// import { python} from '@codemirror/lang-python';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'angulearn';

  // @ViewChild("#divOutput")
  // public divOutput!: ElementRef;
  
  outputSubject = new Subject<string>();
  testStr = "lmao";

  log(x: any) {
    this.outputSubject.next(x);
  }

  public codemirrorEditor!: EditorView;

  ngOnInit() {
    let divOutputSubject = document.getElementById("divOutput");
    console.log(divOutputSubject);
    this.outputSubject.subscribe(x => {
      console.log(x);

      let divLine = document.createElement("div");
      divLine.textContent = typeof x === "object" ? JSON.stringify(x) : x;
      divOutputSubject?.appendChild(divLine);
    });

    this.exercise1();
    this.exercise2();
    this.exercise3();
    this.exercise4();

    const abc = "what's up";
    eval("console.log(abc);");

    // const of = rxjs.of;
    // console.log(rxjs);
    // let x = require('rxjs');
    // console.log(x);
    let y: number = 55;
    const rxjs = rxjsAlias;
    //   Object.keys(rxjs).forEach((key) => {
    //     Object.defineProperty(this, key, {
    //         value: vegetableColors[key]
    //     });
    // });
    // Object.assign(global, rxjs);
    {
      let answer$: Observable<number> = of();

      const jsImportCode = `
        const { ${Object.keys(rxjs).join(",")} } = rxjs;
      `;
      // const jsExerciseSetupCode = `
      //   const { ${Object.keys(this.exercises[0].sources).join(",")} } = this.exercises[0].sources;
      // `;
      console.log(jsImportCode);
      eval(jsImportCode);
      // eval(`
      //   console.log(Observable);
      // `);
      const js = transpile(`
        let x: number = 5555;
        y = 11111;
        console.log(x, y);
        console.log(this);
        const source = of(1, 2, 3);
        source.subscribe((x: number) => {
          console.log(x);
        });
        answer$ = source.pipe(
          map(x => x * 2)
        );
      `);
      console.log(jsImportCode + js);
      eval(jsImportCode + js);
      answer$.subscribe(console.log);
    }
    console.log(y);

    let txtEditor = document.getElementById("txtEditor") as HTMLTextAreaElement;
    let divEditor = document.getElementById("divEditor");
    let language = new Compartment();
    let tabSize = new Compartment();
    this.codemirrorEditor = new EditorView({
      state: EditorState.create({
        doc: `console.log("get in loser!");`,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          language.of(javascript({
            typescript: true,
          })),
        ],
      }),
    });
    this.codemirrorEditor.dom.style.height = "100%";
    divEditor?.appendChild(this.codemirrorEditor.dom);

    this.loadExercise(false);
  }
  
  // Double an input observable.
  exercise1() {
    this.log("[exercise 1] doubling");

    const source = of(1, 2, 3);

    // let answer: Observable<number>;
    // this.answer$ = from(source.forEach(
    //   x => x * 2
    // ));


    // const answerSubscription = this.answer$.subscribe({
    //   next(x: number) {
    //     console.log(x);
    //   }
    // });

    // source.subscribe({
    //   next(x) {
    //     console.log(x * 2);
    //   }
    // }).subscribe({

    // });


    // this.answer$ = source.pipe(
    //   mergeMap(x => x * 2)
    // ).subscribe(x => {
    //   console.log(x);
    // });


    

    // const answer = new Observable((observer) => {
    //   source.subscribe({
    //     next(x) {
    //       observer.next(x * 2);
    //     }
    //   });
    //   return {
    //     unsubscribe() { }
    //   };
    // });

    // answer.subscribe(x => this.log(x));





    // source.forEach(x => console.log(x * 2));



    

    source.pipe(
      map(x => x * 2)
    ).subscribe(x => {
      this.log(x);
    });




    
    // this.answer$ = source.pipe(
    //   map(x => x * 2)
    // );
  }

  // Sum every two values in the observable.
  exercise2() {
    const source = of(1, 2, 3, 4, 5, 6, 7);

    this.log("[exercise 2] every other");

    class Window {
      sum: number;
      count: number;

      constructor(sum: number, count: number) {
        this.sum = sum;
        this.count = count;
      }
    };

    const answer = source.pipe(
      windowCount(2),
      map(win => win.pipe(
        reduce((acc, curr) => new Window(acc.sum + curr, acc.count + 1), new Window(0, 0)),
      )),
      mergeAll(),
      filter(x => x.count == 2),
      map(x => x.sum),
    );

    answer.subscribe(x => this.log(x));

    // answer.subscribe(this.log.bind(this));
    // answer.subscribe(this.log);

    // answer.pipe(
    //   tap(this.log),
    // ).subscribe(() => {});
    // let logFn = this.log;
    // answer.subscribe(logFn);
  }

  exercise3() {
    this.log("[exercise 3] splitting");
    const obs = of(1, 2, "there", "is", "a", 3, 4, "god", 5);
    
    let num_obs = obs.pipe(filter(inp => typeof(inp) === "number"));
    let str_obs = obs.pipe(filter(inp => typeof(inp) === "string"));

    // num_obs.subscribe(console.log);
    // str_obs.subscribe(console.log);
    
    // combineLatestWith(num_obs, str_obs).subscribe(data => {this.log(data[0] + "," + data[1])});

    const answer = zip(str_obs, num_obs).pipe(
      map(([str, num]) => str + " " + num),
    );
    
    answer.subscribe(x => this.log(x));
  }

  exercise4() {
    this.log("[exercise 4] count frequency");

    const obs = of(..."the dog ate the hot dog on the hot day".split(" "));

    // const answer = of(-1);

  //   let ans_obs = obs.pipe(
  //     groupBy(inpstring => inpstring),
  //    // return each item in group as array
  //    mergeMap(group => group.pipe(toArray()))
  //  );

  // let ans_obs = obs.pipe(
  //    groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => group.pipe(count()))
  // );

  // let ans_obs = obs.pipe(
  //    groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => [group.pipe(takeLast(1)), group.pipe(count())])
  // );

  // let ans_obs = obs.pipe(
  //   groupBy(inpstring => inpstring),
  //   // return each item in group as array
  //   mergeMap(group => zip(of(group.key), group.pipe(count())).pipe(
  //     map(([k, v]) => k + ":" + v),
  //   )),
  // );



  // const groups$ = obs.pipe(
  //   groupBy(x => x),
  // );
  // const counts$ = groups$.pipe(
  //   mergeMap(o$ => o$.pipe(
  //     reduce(acc => acc + 1, 0),
  //   )),
  // );
  // const ans_obs = zip(groups$, counts$).pipe(
  //   map(([group, count]) => group.key + ":" + count),
  // );

  let ans_obs = obs.pipe(
    groupBy(identity),
    mergeMap(group$ => zip(of(group$.key), group$.pipe(count())).pipe(
      map(([group, count]) => group + ":" + count),
    )),
  );

   ans_obs.subscribe(x => this.log(x));
  }

  exercise5() {
    // sort a mostly sorted stream, e.g. each number is at most 2 away from its sorted position?
  }

  exercise6() {
    // zip(A, B), but do zip(C, B) if A fails
  }

  exercise7() {
    // merge K sorted streams
  }

  exercise8() {
    // validate that two observables contain the same values, else throw an error
  }

  exerciseXXX() {
    // print 4 3 polyrhythm
  }

  exerciseYYY() {
    // clicking game (red = left click 1pt, blue = right click 2pt, green = middle click 3pt)
    // - how to model spawning?
    // - how to model clicking?
    // - how to model scoring?
  }

  test1() {
    // const arr = new Array(100000000);
    // for (let i = 0; i < arr.length; ++i) {
    //   arr[i] = i;
    // }

    // const source = of(...arr);
    
    // source.subscribe(console.log);

    const dataSource = new Observable(observer => {
      for (let i = 1; i <= 100; i++) {
        observer.next(i);  // Send the next number in the stream to the observers.
      }
    });
    
    dataSource.subscribe(x => console.log("test 1A: " + x));
    dataSource.subscribe(x => console.log("test 1B: " + x));
  }

  test2() {
    // const arr = new Array(100000000);
    // for (let i = 0; i < arr.length; ++i) {
    //   arr[i] = i;
    // }

    // const source = of(...arr);
    
    // source.subscribe(console.log);

    const dataSource = new Observable(observer => {
      // Will run through an array of numbers, emitting one value
      // per second until it gets to the end of the array.
      const end = 100;

      let timeoutId: any;
      function doInSequence(num: number) {
        timeoutId = setTimeout(() => {
          observer.next(num);

          ++num;
          if (num > end) {
            observer.complete();
          } else {
            doInSequence(num);
          }
        }, 0);
      }
      doInSequence(0);
    
      // Unsubscribe should clear the timeout to stop execution
      return {
        unsubscribe() {
          clearTimeout(timeoutId);
        }
      };
    });
    
    dataSource.subscribe(x => console.log("test 2A: " + x));
    dataSource.subscribe(x => console.log("test 2B: " + x));
  }

  public solutionExercise1(source$: Observable<number>): Observable<number> {
    return source$.pipe(
      map(x => x << 1),
    );
  }

  public solutionExercise2(source$: Observable<number>): Observable<number> {
    class Window {
      sum: number;
      count: number;

      constructor(sum: number, count: number) {
        this.sum = sum;
        this.count = count;
      }
    };

    return source$.pipe(
      windowCount(2),
      map(win$ => win$.pipe(
        reduce((acc, curr) => new Window(acc.sum + curr, acc.count + 1), new Window(0, 0)),
      )),
      mergeAll(),
      filter(x => x.count == 2),
      map(x => x.sum),
    );
  }

  public solutionExercise3(source$: Observable<number | string>): Observable<string> {
    let nums$ = source$.pipe(filter(inp => typeof(inp) === "number"));
    let strs$ = source$.pipe(filter(inp => typeof(inp) === "string"));

    return zip(strs$, nums$).pipe(
      map(([str, num]) => str + " " + num),
    );
  }

  public referenceFnObservable(f: (...args: any[]) => any): (args: any[], result: any) => Promise<boolean> {
    return (args: any[], result: Observable<any>) => {
      let expected: Observable<any> = f(...args);
      return this.observablesEqual(result, expected);




      // let equal$ = zip(result, expected).pipe(
      //   map(([a, b]) => a === b),
      //   reduce((acc, cur) => acc && cur, true),
      // );
      // return firstValueFrom(equal$);




      // let equal$ = sequenceEqual(result, expected);
      // equal$.subscribe(console.log);
      // return false;
      // return await firstValueFrom(equal$);
    };
  }

  public async observableToArray<T>(observable$: Observable<T>): Promise<T[]> {
    let array$ = observable$.pipe(
      toArray(),
    );
    return await firstValueFrom(array$);
  }

  public observablesEqual(a$: Observable<any>, b$: Observable<any>): Promise<boolean> {
    let equal$ = a$.pipe(
      sequenceEqual(b$),
    );
    return firstValueFrom(equal$);

    // let x = sequenceEqual(of(a$), of(b$)).pipe(

    // )

    // let equal$ = zip(a$, b$).pipe(
    //   map(([a, b]) => { console.log(a, b); return a === b; }),
    //   reduce((acc, cur) => acc && cur, true),
    // );
    // return firstValueFrom(equal$);
  }

  public async observableArgsToString(args: Observable<any>[]): Promise<string[]> {
    let argsStrArray: string[] = [];
    for (const arg of args) {
      let arr = await this.observableToArray(arg);
      argsStrArray.push(arr.join(", "));
    }
    return argsStrArray;
  }

  // TODO: finish adding more exercises.
  // TODO: make a way to switch exercises.
  public exercises: Exercise[] = [
    new Exercise(
      "doubleNumbers",
      "Double Numbers",
      "Given an Observable<number>, return an Observable<number> with the original values doubled.  For example [1, 2, 3] -> [2, 4, 6].",
      new FunctionDefinition(
        "doubleNumbers",
        "Observable<number>",
        [
          new Parameter("source$", "Observable<number>"),
        ],
      ),
      [
        new TestCase(
          [of(1, 2, 3)],
          this.referenceFnObservable(this.solutionExercise1)  // example usage of `referenceFnObservable`
        ),
        new TestCase(
          [of(-100, 0, 0, 2023)],
          async (_, result) => this.observablesEqual(result, of(-200, 0, 0, 4046))  // example usage of `observablesEqual`
        ),
      ],
    ),
    new Exercise(
      "sumConsecutiveTwo",
      "Sum Consecutive Two",
      "Given an Observable<number>, return an Observable<number> containing the sum of each two consecutive elements.  For example [1, 2, 3, 4, 5, 6, 100] -> [3, 7, 13].  Note that the final 100 is omitted.",
      new FunctionDefinition(
        "sumConsecutiveTwo",
        "Observable<number>",
        [
          new Parameter("source$", "Observable<number>"),
        ],
      ),
      [
        new TestCase(
          [of(1, 2, 3, 4, 5, 6, 7)],
          this.referenceFnObservable(this.solutionExercise2)
        ),
        new TestCase(
          [of(-1, 2, -3, 4, -5, 6)],
          this.referenceFnObservable(this.solutionExercise2)
        ),
      ],
    ),
    new Exercise(
      "splitAndJoin",
      "Split and Join",
      `Given an Observable<number | string>, return an Observable<string> where the i-th value contains the the i-th string and the i-th number separated by a space.  For example [2, 3, "i", "like", "prime", 5, 7, "numbers", 11] -> ["i 2", "like 3", "prime 5", "numbers 7"].  Note that the final 11 is omitted because it doesn't have a string to go with it.`,
      new FunctionDefinition(
        "splitAndJoin",
        "Observable<string>",
        [
          new Parameter("source$", "Observable<number | number>"),
        ],
      ),
      [
        new TestCase(
          [of(2, 3, "i", "like", "prime", 5, 7, "numbers", 11)],
          this.referenceFnObservable(this.solutionExercise3)
        ),
        new TestCase(
          [of("hello", -1, "world", 0)],
          this.referenceFnObservable(this.solutionExercise3)
        ),
      ],
    ),
  ];

  // The following two need to be kept in sync!
  // TODO: delete one of them...
  public exerciseIdx: number = 0;
  public exercise: Exercise = this.exercises[0];

  // TODO: save user code somehow...
  public userCode: string[] = Array<string>(this.exercises.length);

  setExercise(exercise: Exercise) {
    this.exercise = exercise;
    this.loadExercise(true);
    console.log("userCode: ", this.userCode[0]);
  }

  makeCodeTemplate(exercise: Exercise): string {
    const fnDef = exercise.functionDefinition;
    let codeLines: string[] = [];
    let paramsAsString = fnDef.parameters.map(x => `${x.name}: ${x.type}`).join(", ");
    codeLines.push(`function ${fnDef.functionName}(${paramsAsString}): ${fnDef.returnType} {`);
    codeLines.push(`  `);
    codeLines.push("}");
    return codeLines.join("\n");
  }

  setCode(code: string) {
    this.codemirrorEditor.dispatch({
      changes: {
        from: 0,
        to: this.codemirrorEditor.state.doc.length,
        insert: code,
      },
    });
  }

  loadExercise(shouldPrompt: boolean) {
    const exercise = this.exercise;
    
    const exerciseKey = this.makeStorageKey(this.exercise);
    let code = localStorage.getItem(exerciseKey);
    if (code === null) {
      code = this.makeCodeTemplate(exercise);
    }

    const currCode = this.codemirrorEditor.state.doc.toString();
    console.log("what is", currCode)
    if (shouldPrompt && code !== currCode && !confirm("You will lose any unsaved changes.  Continue?")) {
      return;
    }

    this.setCode(code);
  }

  resetCode() {
    this.setCode(this.makeCodeTemplate(this.exercise));
  }

  saveCode() {
    const exerciseKey = this.makeStorageKey(this.exercise);
    localStorage.setItem(exerciseKey, this.codemirrorEditor.state.doc.toString());
  }

  loadCode() {
    const exerciseKey = this.makeStorageKey(this.exercise);
    const code = localStorage.getItem(exerciseKey);
    if (code === null) {
      return;
    }
    const currCode = this.codemirrorEditor.state.doc.toString();
    if (code !== currCode && !confirm("This will discard your unsaved changes. Continue?")) {
      return;
    }
    this.codemirrorEditor.dispatch({
      changes: {
        from: 0,
        to: currCode.length,
        insert: code,
      },
    });
  }

  makeStorageKey(exercise: Exercise): string {
    return `exercise:${exercise.id}`;
  }

  async runCode() {
    const exercise = this.exercise;

    let answer$: Observable<number> = of();

    const rxjs = rxjsAlias;
    const jsImportCode = `
      const { ${Object.keys(rxjs).join(",")} } = rxjs;
    `;
    console.log(jsImportCode);
    eval(jsImportCode);
    let f: any;
    // eval(`
    //   console.log(Observable);
    // `);
    const ts = this.codemirrorEditor.state.doc.toString();
    console.log(ts);
    const tsAssignCode = `
      f = ${exercise.functionDefinition.functionName};
    `;

    // TODO: does transpile never throw an error?
    const js = transpile(ts + tsAssignCode);
    console.log(jsImportCode + js);

    try {
      eval(jsImportCode + js);
    } catch (err) {
      alert(`Got an error in loading function:\n\n${err}`);
      return;
    }

    let allMatched = true;
    let failureMessages = [];
    for (const testCase of exercise.testCases) {
      let result: any;
      try {
        result = f(...testCase.args);
      } catch (err) {
        alert(`Got an error in executing function:\n\n${err}`);
        return;
      }

      let matched: boolean;
      try {
        matched = await testCase.checker(testCase.args, result);
      } catch (err) {
        alert(`Got an error in evaluating output:\n\n${err}`);
        return;
      }

      if (!matched) {
        // TODO: only supports printing out Observable input and types???
        let argsAsStr: string[] = [];
        for (const arg of testCase.args) {
          let arr = await this.observableToArray(arg);
          argsAsStr.push(arr.join(", "));
        }
        let resultArr = await this.observableToArray(result);
        failureMessages.push(`input [${argsAsStr.join(", ")}] -> your incorrect output: [${resultArr.join(", ")}]`);
      }
      allMatched &&= matched;
    }

    if (allMatched) {
      alert("SUCCESS!");
    } else {
      alert("Failed... please try again!\n\n" + failureMessages.join("\n\n"));
    }
  }
}

class Exercise {
  public id: string;
  public name: string;
  public description: string;
  public functionDefinition: FunctionDefinition;
  public testCases: TestCase[];

  // public sources: any;
  // public solutions: string[];
  // public outputs: any;

  constructor(id: string, name: string, description: string, functionDefinition: FunctionDefinition, testCases: TestCase[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.functionDefinition = functionDefinition;
    this.testCases = testCases;

    // this.sources = sources;
    // this.outputs = outputs;
  }
}

class FunctionDefinition {
  public functionName: string;
  public returnType: string;
  public parameters: Parameter[];

  constructor(functionName: string, returnType: string, parameters: Parameter[]) {
    this.functionName = functionName;
    this.returnType = returnType;
    this.parameters = parameters;
  }
}

class Parameter {
  public name: string;
  public type: string;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

class TestCase {
  public args: any[];
  public checker: (args: any[], result: any) => Promise<boolean>;

  constructor(args: any[], checker: (args: any[], result: any) => Promise<boolean>) {
    this.args = args;
    this.checker = checker;
  }
}