# Triviality !heading

Your application is full of useful objects: a "HttpClient"
object might help you send requests while another object might
help you save things to some storage. Almost everything that your
application "does" is actually done by one of these objects.

In Triviality, these useful objects are called services and
each service lives inside a very special object
called the service container. The approach how a service is constructed and configured
is the definition of the service or in short the service definition.
The container allows you to centralize the way objects are constructed.
It makes your life easier, promotes a strong architecture. It’s
a design pattern aiming to make high-level code reusable.

## Why should you use Triviality !heading

Triviality is inspired by the idea that non-trival issues should not
take your precious time and **infect** your application code. **Triviality** highly aims to keep away from your application code.
By separating the service definition from usage. **No magic** injection with tokens and/or annotations whatsoever. It will use your application code
as a **strictly typed interface** to assure everything is connected properly.

> Parkinson's law of triviality is C. Northcote Parkinson's 1957 argument
that members of an organization give disproportionate weight to trivial issues.
Parkinson provides the example of a fictional committee whose job was
to approve the plans for a nuclear power plant spending the majority
of its time on discussions about relatively minor but easy-to-grasp issues,
such as what materials to use for the staff bike shed, while neglecting the proposed
design of the plant itself, which is far more important and a
far more difficult and complex task.

### Typescript to the rescue !heading

Triviality uses the full power of Typescript to ensure the ServiceContainer
is connected properly before your application code even has executed.

> It's not required to use Typescript when using Triviality, but it's highly recommended.

#include "docs/_intro.md"

