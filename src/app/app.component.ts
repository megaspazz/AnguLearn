import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject, combineLatest, combineLatestWith, concat, concatWith, count, every, filter, firstValueFrom, from, groupBy, identity, of, last, map, mergeAll, mergeMap, noop, reduce, repeat, sequenceEqual, scan, shareReplay, skip, takeLast, tap, toArray, windowCount, zip } from 'rxjs';
import { createJsxJsxClosingFragment, transpile } from 'typescript';

import * as rxjsAlias from 'rxjs';

// import { CodeMirror } from '@codemirror';
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from 'codemirror';
import { indentWithTab } from "@codemirror/commands";
import { acceptCompletion } from "@codemirror/autocomplete";
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

    // console.log(Solution.almostSorted.toString());

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
          keymap.of([
            indentWithTab,
            // TODO: figure out how to accept autocomplete suggestions with [Tab] key.
            {
              key: "Tab",
              run: acceptCompletion,
            },
          ]),
          language.of(javascript({
            typescript: true,
          })),
        ],
      }),
    });
    this.codemirrorEditor.dom.style.height = "100%";
    divEditor?.appendChild(this.codemirrorEditor.dom);

    this.loadExercise(this.exercise, false);
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

  public checkConstantObservable(expectedAnswer$: Observable<any>): (args: any[], result: any) => Promise<boolean> {
    // console.log("expectedAnswer$", expectedAnswer$);
    return async (_, userResult$: any) => this.observablesEqual(userResult$, expectedAnswer$);
  }

  public checkConstantObservableIgnoreOrder(expectedAnswer$: Observable<any>): (args: any[], result: any) => Promise<boolean> {
    return async (_, userResult$: any) => this.observablesEqualIgnoreOrder(userResult$, expectedAnswer$);
  }

  public checkReferenceFnObservable(f: (...args: any[]) => any): (args: any[], result: any) => Promise<boolean> {
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

  public checkReferenceFnObservableIgnoreOrder(f: (...args: any[]) => any): (args: any[], result: any) => Promise<boolean> {
    return (args: any[], result: Observable<any>) => {
      let expected: Observable<any> = f(...args);
      return this.observablesEqualIgnoreOrder(result, expected);
    };
  }

  public async observableToArray<T>(observable$: Observable<T>): Promise<T[]> {
    // console.log("observable$", typeof observable$, observable$);
    // observable$.subscribe(
    //   x => console.log("DEBUG", x),
    // );
    let array$ = observable$.pipe(
      toArray(),
    );
    return await firstValueFrom(array$);
  }

  // TODO: replace this with some sort of deepEquals() function instead.
  public observablesEqual(userAnswer$: Observable<any>, expectedAnswer$: Observable<any>): Promise<boolean> {
    let equal$ = userAnswer$.pipe(
      sequenceEqual(expectedAnswer$, (a, b) => {
        if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) {
            return false;
          }
          for (let i = 0; i < a.length; ++i) {
            if (a[i] != b[i]) {
              return false;
            }
          }
          return true;
        }
        return a === b;
      }),
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

  public observablesEqualIgnoreOrder(userAnswer$: Observable<any>, expectedAnswer$: Observable<any>): Promise<boolean> {
    let equalIgnoreOrder$ = zip(userAnswer$.pipe(toArray()), expectedAnswer$.pipe(toArray())).pipe(
      every(([userArray, expectedArray]) => {
        const sortedUserArray = [...userArray].sort();
        const sortedExpectedArray = [...expectedArray].sort();
        if (sortedUserArray.length !== sortedExpectedArray.length) {
          return false;
        }
        for (let i = 0; i < sortedUserArray.length; ++i) {
          if (sortedUserArray[i] !== sortedExpectedArray[i]) {
            return false;
          }
        }
        return true;
      }),
    );
    return firstValueFrom(equalIgnoreOrder$);
  }

  public async observableArgsToString(args: Observable<any>[]): Promise<string[]> {
    let argsStrArray: string[] = [];
    for (const arg of args) {
      let arr = await this.observableToArray(arg);
      argsStrArray.push(arr.map(x => {
        if (x.toString !== Object.prototype.toString) {
          return x.toString();
        }
        return JSON.stringify(x);
      }).join(", "));
    }
    return argsStrArray;
  }

  // TODO: finish adding more exercises.
  // TODO: add versioning to exercises in case signatures change.
  // TODO: support HTML or markdown or some other way to display richer content for the exercise descriptions and sample test cases.
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
          this.checkReferenceFnObservable(Solution.doubleNumbers)  // example usage of `checkReferenceFnObservable`
        ),
        new TestCase(
          [of(-100, 0, 0, 2023)],
          this.checkConstantObservable(of(-200, 0, 0, 4046)),  // example usage of `checkConstantObservable`
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
          this.checkReferenceFnObservable(Solution.sumConsecutiveTwo)
        ),
        new TestCase(
          [of(-1, 2, -3, 4, -5, 6)],
          this.checkReferenceFnObservable(Solution.sumConsecutiveTwo)
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
          this.checkReferenceFnObservable(Solution.splitAndJoin)
        ),
        new TestCase(
          [of("hello", -1, "world", 0)],
          this.checkReferenceFnObservable(Solution.splitAndJoin)
        ),
      ],
    ),
    new Exercise(
      "countWordFrequency",
      "Count Word Frequency",
      `Given an Observable<string>, return an Observable<string> where each value is in the form '$word:$frequency' for each unique $word in the input, $frequency is the number of occurrences of the $word in the input.  For example, ["a", "b", "A", "b"] -> ["a:1", "b:2", "A:1"].`,
      new FunctionDefinition(
        "countWordFrequency",
        "Observable<string>",
        [
          new Parameter("source$", "Observable<string>"),
        ],
      ),
      [
        new TestCase(
          [of("a", "b", "A", "b")],
          this.checkConstantObservableIgnoreOrder(of("A:1", "a:1", "b:2")),  // example usage of `checkConstantObservableIgnoreOrder`
        ),
        new TestCase(
          [of("the dog ate the hot dog on the hot day".split(" "))],
          this.checkReferenceFnObservableIgnoreOrder(Solution.countFrequency),
        ),
      ],
    ),
    new Exercise(
      "almostSorted",
      "Almost Sorted",
      `Given an almost-sorted Observable<number> where each number is at most two positions away from its sorted position, return an Observable<number> containing the input in sorted order.  For example, [3, 2, 1, 4, 7, 6, 5, 8] -> [1, 2, 3, 4, 5, 6, 7, 8].`,
      new FunctionDefinition(
        "almostSorted",
        "Observable<number>",
        [
          new Parameter("source$", "Observable<number>"),
        ],
      ),
      [
        new TestCase(
          [of(3, 2, 1, 4, 7, 6, 5, 8)],
          this.checkConstantObservable(of(1, 2, 3, 4, 5, 6, 7, 8)),
        ),
        new TestCase(
          [of(-6, -7, -8, 0, 17, 16, 15, 18)],
          this.checkConstantObservable(of(-8, -7, -6, 0, 15, 16, 17, 18)),
        ),
        // TODO: generate more test cases, and check against Solution.almostSorted.
      ],
    ),
    new Exercise(
      "inventoryTracker",
      "Inventory Tracker",
      `Given an Observable<InventoryEvent> representing updates to an inventory, return an Observable<number> representing the actual update applied for the given item ID.  For remove operations (quantity < 0), output a negative number representing the actual amount removed.  If there is enough of the item in the inventory, remove the desired quantity.  Otherwise, remove all remaining items.  Similarly, for add operations (quantity > 0), add as many items as you can without exceeding the max capacity, and return the number of items added.  For example, with a maxCapacity of 10, with events [{"apple", 4}, {"banana", 9}, {"banana", -9}, {"apple", -1}], we should get [4, 6, -6, -1].  In the first operation, we add 4 apples, and our total size is 4.  In the second operation, we want to add 9 bananas, but we only have space for 6 more items, since we already have 4 apples, so we only add 6 bananas.  In the third operation, we want to remove 9 bananas, but we only have 6 bananas, so we can only remove 6.  In the fourth operation, we want to remove a single apple.  Since we have currently have 4 apples, we are able to remove the desired quantity.`,
      new FunctionDefinition(
        "trackInventory",
        "Observable<number>",
        [
          new Parameter("source$", "Observable<InventoryEvent>"),
          new Parameter("maxCapacity", "number"),
        ],
      ),
      [
        new TestCase(
          [
            of(
              new InventoryEvent("apple", 4),
              new InventoryEvent("banana", 9),
              new InventoryEvent("banana", -9),
              new InventoryEvent("apple", -1),
            ),
            10,
          ],
          this.checkConstantObservable(of(4, 6, -6, -1)),
        ),
        new TestCase(
          [
            of(
              new InventoryEvent("asparagus", 33),
              new InventoryEvent("broccoli", 66),
              new InventoryEvent("asparagus", 99),
              new InventoryEvent("asparagus", 0),
              new InventoryEvent("asparagus", -100),
              new InventoryEvent("asparagus", -100),
              new InventoryEvent("asparagus", 0),
              new InventoryEvent("broccoli", 1000),
              new InventoryEvent("broccoli", -1000),
              new InventoryEvent("carrot", -100),
              new InventoryEvent("carrot", 100),
              new InventoryEvent("daikon_radish", 100),
            ),
            100,
          ],
          this.checkConstantObservable(of(33, 66, 1, 0, -34, 0, 0, 34, -100, 0, 100, 0)),
        ),
        // TODO: generate more test cases, and check against Solution.trackInventory.
      ],
      INVENTORY_EVENT_STR,
    ),
    new Exercise(
      "rotationPairing",
      "Rotation Pairing",
      `Given an Observable<string> and a "circular queue" of Observable<string> containing items to match with, pair the items from "source$" with the items in sequence in "matchWith" and return them in an Observable<[string, string]> containing tuples of the matched pairs.  For example, given a source$ of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] and a matchPairs of [["a"], ["b", "c"], ["d"]], return [["1", "a"],["2", "b"],["3", "c"],["4", "d"],["5", "a"],["6", "b"],["7", "c"],["8", "d"],["9", "a"],["10", "b"]].  The first pair contains the first item from source$ and the first item from matchWith[0] (0-indexed).  For the second item, it is paired with the first item from matchWith[1], since the single item from matchWith[0] got used up.  For the third item, it is paired with the second item from matchWith[1].  For the fourth item, it is paired with the first item from matchWith[2], since the items from matchWith[1] all got used.  For the fifth item, it loops back around the "circular queue" and then matches again with the first item of matchWith[0].  This goes on until all items from source$ are paired up.`,
      new FunctionDefinition(
        "rotationPairing",
        "Observable<[string, string]>",
        [
          new Parameter("source$", "Observable<string>"),
          new Parameter("matchWith", "Observable<string>[]"),
        ],
      ),
      [
        new TestCase(
          [
            of("1", "2", "3", "4", "5", "6", "7", "8", "9", "10"),
            [
              of("a"),
              of("b", "c"),
              of("d"),
            ],
          ],
          this.checkConstantObservable(of(
            ["1", "a"],
            ["2", "b"],
            ["3", "c"],
            ["4", "d"],
            ["5", "a"],
            ["6", "b"],
            ["7", "c"],
            ["8", "d"],
            ["9", "a"],
            ["10", "b"],
          )),
        ),
        new TestCase(
          [
            of("uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"),
            [
              of("first A", "first B", "first C"),
              of("second A"),
              of("third A", "third B"),
            ]
          ],
          this.checkConstantObservable(of(
            ["uno", "first A"],
            ["dos", "first B"],
            ["tres", "first C"],
            ["cuatro", "second A"],
            ["cinco", "third A"],
            ["seis", "third B"],
            ["siete", "first A"],
            ["ocho", "first B"],
            ["nueve", "first C"],
            ["diez", "second A"],
          )),
        ),
        new TestCase(
          [
            of("X", "Y", "Z"),
            [
              of("1"),
              of("2", "3", "4", "5", "6"),
            ],
          ],
          this.checkConstantObservable(of(
            ["X", "1"],
            ["Y", "2"],
            ["Z", "3"],
          )),
        ),
      ],
    ),
    // TODO: how to actually solve this problem?
    new Exercise(
      "mergeSortedStreams",
      "Merge Sorted Streams",
      // TODO: write example.
      `Given an array of Observable<number> where each one is sorted, merge them all into a single sorted Observable<number>.`,
      new FunctionDefinition(
        "mergeSortedStreams",
        "Observable<number>",
        [
          new Parameter("streams", "Observable<number>[]"),
        ],
      ),
      [
        new TestCase(
          [
            [
              of(2, 4, 6),
              of(3, 6),
              of(6),
              of(2, 3, 5),
            ],
          ],
          this.checkConstantObservable(of(2, 2, 3, 3, 4, 5, 6, 6, 6)),
        ),
      ],
    ),
    // TODO: build more exercises!!!
  ];

  // The following two need to be kept in sync!
  // TODO: delete one of them...
  public exerciseIdx: number = 0;
  public exercise: Exercise = this.exercises[0];

  // TODO: save user code somehow...
  public userCode: string[] = Array<string>(this.exercises.length);

  changeExercise(event: any) {
    const exercise = event.value;
    if (this.loadExercise(exercise, true)) {
      this.exercise = exercise;
    } else {
      event.source.writeValue(this.exercise);
    }
  }

  setExercise(exercise: Exercise) {
    if (this.loadExercise(exercise, true)) {
      this.exercise = exercise;
    }
  }

  makeCodeTemplate(exercise: Exercise): string {
    const fnDef = exercise.functionDefinition;
    let codeLines: string[] = [];
    let paramsAsString = fnDef.parameters.map(x => `${x.name}: ${x.type}`).join(", ");
    codeLines.push(`function ${fnDef.functionName}(${paramsAsString}): ${fnDef.returnType} {`);
    codeLines.push(`  `);
    codeLines.push("}");
    if (typeof exercise.comments !== "undefined") {
      codeLines.push("");
      codeLines.push(exercise.comments!);
    }
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

  loadExercise(exercise: Exercise, shouldPrompt: boolean): boolean {
    let currExerciseKey = this.makeStorageKey(this.exercise);
    let savedCode = localStorage.getItem(currExerciseKey);
    if (savedCode === null) {
      savedCode = this.makeCodeTemplate(this.exercise);
    }

    const currCode = this.codemirrorEditor.state.doc.toString();

    console.log(savedCode, "|", currCode);
    if (shouldPrompt && savedCode !== currCode && !confirm("You will lose any unsaved changes.  Continue?")) {
      return false;
    }

    const exerciseKey = this.makeStorageKey(exercise);
    let code = localStorage.getItem(exerciseKey);
    if (code === null) {
      code = this.makeCodeTemplate(exercise);
    }

    this.setCode(code);

    return true;
  }

  // TODO: warn before resetting?
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

  arrayToString(arr: any[]): string {
    return arr.map(x => {
      if (x.toString !== Object.prototype.toString) {
        return x.toString();
      }
      return JSON.stringify(x);
    }).join(", ");
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
    // TODO: add compiler options so that it can catch some problems at transpile time?
    const js = transpile(ts + tsAssignCode);
    console.log(jsImportCode + js);

    try {
      eval(jsImportCode + js);
    } catch (err) {
      alert(`Got an error in loading function:\n\n${err}`);
      return;
    }

    let allMatched = true;
    let failureMessages: any[] = [];
    for (const testCase of exercise.testCases) {
      let result: any;
      let resultReplay$: Subject<any> = new Subject<any>();
      try {
        result = f(...testCase.args).pipe(shareReplay());
        // resultReplay = resulne
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
        failureMessages.push(`input (${await this.deepToString(testCase.args)}) -> your incorrect output: (${await this.deepToString(result)})`);
      }
      allMatched &&= matched;
    }

    if (allMatched) {
      alert("SUCCESS!");
    } else {
      alert("Failed... please try again!\n\n" + failureMessages.join("\n\n"));
    }
  }

  // TODO: add support for more types as needed?
  async deepToString(x: any): Promise<string> {
    if (x instanceof Observable) {
      let arr = await this.observableToArray(x);
      return this.deepToString(arr);
    } else if (Array.isArray(x)) {
      let arrStr = await Promise.all(x.map(async (val) => this.deepToString(val)));
      return "[" + arrStr.join(", ") + "]";
    } else {
      return x.toString();
    }
  }
}

function makeComment(text: string): string {
  return text.split(/\r?\n/g).map(line => "// " + line).join("\n");
}

class Exercise {
  public id: string;
  public name: string;
  public description: string;
  public functionDefinition: FunctionDefinition;
  public testCases: TestCase[];
  public comments?: string;

  // public sources: any;
  // public solutions: string[];
  // public outputs: any;

  constructor(id: string, name: string, description: string, functionDefinition: FunctionDefinition, testCases: TestCase[], comments?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.functionDefinition = functionDefinition;
    this.testCases = testCases;
    this.comments = comments;

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

// TODO: have better way than simply copy-pasting this.
class InventoryEvent {
  // ID of the item.
  public itemId: string;

  // Amount changed.
  //   * A positive value means adding to the inventory.
  //   * A negative value means removing from the inventory.
  public quantity: number;

  constructor(itemId: string, quantity: number) {
    this.itemId = itemId;
    this.quantity = quantity;
  }

  public toString(): string {
    return `{${this.itemId}, ${this.quantity}}`;
  }
}

const INVENTORY_EVENT_STR = `
/*
interface InventoryEvent {
  // Case-sensitive identifier for an item.
  public itemId: string;

  // Amount of items to be added or removed.
  //   * A positive number means adding items.
  //   * A negative number means removing items.
  public quantity: number;
}
*/
`.trim();

abstract class Solution {
  public static doubleNumbers(source$: Observable<number>): Observable<number> {
    return source$.pipe(
      map(x => x << 1),
    );
  }

  public static sumConsecutiveTwo(source$: Observable<number>): Observable<number> {
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

  public static splitAndJoin(source$: Observable<number | string>): Observable<string> {
    let nums$ = source$.pipe(filter(inp => typeof(inp) === "number"));
    let strs$ = source$.pipe(filter(inp => typeof(inp) === "string"));

    return zip(strs$, nums$).pipe(
      map(([str, num]) => str + " " + num),
    );
  }

  public static countFrequency(source$: Observable<string>): Observable<string> {
    return source$.pipe(
      groupBy(identity),
      mergeMap(group$ => zip(of(group$.key), group$.pipe(count())).pipe(
        map(([group, count]) => group + ":" + count),
      )),
    );
  }

  // TODO: replace accumulator array with heap!
  public static almostSorted(source$: Observable<number>): Observable<number> {
    return source$.pipe(
      concatWith(of(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)),
      scan((acc, cur) => {
        acc.push(cur);
        acc.sort((a, b) => a - b);
        if (acc.length > 3) {
          acc = acc.slice(1);
        }
        return acc;
      }, Array<number>()),
      map(arr => arr[0]),
      skip(2),
    );
  }

  public static trackInventory(source$: Observable<InventoryEvent>, maxCapacity: number): Observable<number> {
    class Inventory {
      total: number = 0;
      items: Map<string, number> = new Map<string, number>();
    }
  
    class InventoryState {
      inventory: Inventory = new Inventory();
      currentOutput: number = 0;
    }
  
    return source$.pipe(
      scan(((state, event) => {
        let currentItemQuantity = state.inventory.items.get(event.itemId) ?? 0;
        console.log(currentItemQuantity);
        if (event.quantity >= 0) {
          let remainingCapacity = maxCapacity - state.inventory.total;
          let addQuantity = Math.min(event.quantity, remainingCapacity);
          state.inventory.items.set(event.itemId, currentItemQuantity + addQuantity);
          state.inventory.total += addQuantity;
          state.currentOutput = addQuantity;
        } else {
          let removeQuantity = Math.min(currentItemQuantity, -event.quantity);
          state.inventory.items.set(event.itemId, currentItemQuantity - removeQuantity);
          state.inventory.total -= removeQuantity;
          state.currentOutput = -removeQuantity;
        }
        return state;
      }), new InventoryState()),
      map(state => state.currentOutput),
    );
  }
  
  public static circularRotation(source$: Observable<string>, matchWith: Observable<string>[]): Observable<[string, string]> {
    return zip(
      source$,
      concat(...matchWith).pipe(
        repeat(),
      ),
    );
  }
}