# Triviality !heading

Dependency Injection is all about code reusability. 
It’s a design pattern aiming to make high-level code reusable, 
by separating the object creation / configuration from usage. **Triviality** highly aims to keep away from your application code. 
**No magic** injection with tokens, annotations whatsoever. It will use your application code 
as **strictly typed interface** to assure everything is connected properly. 

Triviality by core is split into Modules. A module is defined a class.

#typescript "docs/LogModule.ts"

Each class has functions on them. The function name is the service key. 

#typescript "docs/intro.ts"
