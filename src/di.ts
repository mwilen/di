type Class = {
  new (...args: any[]): InstanceType<ObjectConstructor>;
};

type Metadata = {
  instance?: InstanceType<Class>;
  ctor: Class;
  args: any[];
};

const tokens: {
  [key in string]: Metadata;
} = {};

export function instantiate(): void {
  console.log('tokens', tokens);
  for (const token in tokens) {
    initDependency(token, tokens[token]);
  }
}

function initDependency(token: string, { ctor, args }: Metadata): void {
  const instance = new ctor(...(args.length ? args : []));
  if (!tokens[token].instance) {
    tokens[token].instance = instance;
  }
}

export function register<T extends Class>(
  classCtor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  const name = classCtor.name;

  if (!tokens[name]) {
    tokens[name] = {
      ctor: classCtor,
      args,
    };
  }

  return tokens[name] as InstanceType<T>;
}

export function inject<T extends Class>(token: T): InstanceType<T> {
  const name = token.name;

  if (!tokens[name]) {
    throw new Error(
      `Class with name ${token.name} is not registered for dependency injection.`
    );
  }

  if (!tokens[name].instance) {
    initDependency(name, tokens[name]);
  }

  return tokens[name].instance as InstanceType<T>;
}
