import './style.css';
import { inject, instantiate, register } from './di.ts';

class Foo {
  a = 1;
  b = 'c';

  constructor(private a1: string, private a2: string) {
    this.a1;
    this.a2;
  }
}

class Bar {
  a = 1;
  b = 'c';
  foo = inject(Foo);

  constructor() {
    console.log('foo in bar', this.foo);
  }
}

class Zyx {
  foo = inject(Foo);
  bar = inject(Bar);

  constructor() {
    console.log('foo in Zyx', this.foo, this.bar);
  }
}

register(Bar);
register(Foo, 'hello', 'world');
instantiate();

const zyx = new Zyx();
const foo = inject(Foo);
foo.a = 420;
const bar = inject(Bar);
console.log(zyx.bar === bar);
// console.log(foo.a, bar.foo.a);
// console.log(foo === bar.foo);
