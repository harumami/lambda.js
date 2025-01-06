const unit = {
    from: t => u => u,
    unit: u => u,
    into: u => u(null),
}

const bool = {
    from: b => t => f => b ? t : f,
    tru: t => f => t,
    fls: t => f => f,
    not: b => t => f => b(f)(t),
    and: b1 => b2 => t => f => b1(b2(t)(f))(f),
    or: b1 => b2 => t => f => b1(t)(b2(t)(f)),
    into: b => b(true)(false),
}

const nat = {
    from: n => s => z => Array(n).fill().reduce(a => s(a), z),
    zero: s => z => z,
    succ: n => s => z => s(n(s)(z)),
    add: n1 => n2 => s => z => n1(s)(n2(s)(z)),
    mul: n1 => n2 => s => z => n1(n2(s))(z),
    pred: n => s => z => n(o => t => t(o(s)))(t => z)(o => o),
    into: n => n(n => n + 1)(0),
}

const int = {
    from: n => s => s(n)(nat.zero),
    neg: i => i(n1 => n2 => s => s(n2)(n1)),
    add: i1 => i2 => s => s(nat.add(i1(n1 => n2 => n1))(i2(n1 => n2 => n1)))(nat.add(i1(n1 => n2 => n2))(i2(n1 => n2 => n2))),
    sub: i1 => i2 => s => s(nat.add(i1(n1 => n2 => n1))(i2(n1 => n2 => n2)))(nat.add(i1(n1 => n2 => n2))(i2(n1 => n2 => n1))),
    mul: i1 => i2 => s => s(nat.add(nat.mul(i1(n1 => n2 => n1))(i2(n1 => n2 => n1)))(nat.mul(i1(n1 => n2 => n2))(i2(n1 => n2 => n2))))(nat.add(nat.mul(i1(n1 => n2 => n1))(i2(n1 => n2 => n2)))(nat.mul(i1(n1 => n2 => n2))(i2(n1 => n2 => n1)))),
    into: i => i(n1 => n2 => nat.into(n1) - nat.into(n2)),
}

const rat = {
    from: i => d => d(i)(int.from(nat.succ(nat.zero))),
    neg: r => d => r(i1 => i2 => d(int.neg(i1))(i2)),
    add: r1 => r2 => d => d(int.add(int.mul(r1(i1 => i2 => i1))(r2(i1 => i2 => i2)))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i1))))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i2))),
    sub: r1 => r2 => d => d(int.sub(int.mul(r1(i1 => i2 => i1))(r2(i1 => i2 => i2)))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i1))))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i2))),
    mul: r1 => r2 => d => d(int.mul(r1(i1 => i2 => i1))(r2(i1 => i2 => i1)))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i2))),
    div: r1 => r2 => d => d(int.mul(r1(i1 => i2 => i1))(r2(i1 => i2 => i2)))(int.mul(r1(i1 => i2 => i2))(r2(i1 => i2 => i1))),
    into: r => r(i1 => i2 => int.into(i1) / int.into(i2)),
}

const pair = {
    from: f1 => f2 => o => p => p(f1(o[0]))(f2(o[1])),
    pair: f => s => p => p(f)(s),
    fst: p => p(f => s => f),
    snd: p => p(f => s => s),
    swap: p => q => p(f => s => q(s)(f)),
    into: i1 => i2 => p => p(f => s => [i1(f), i2(s)]),
}

const list = {
    from: f => l => c => n => l.reverse().reduce((a, e) => c(f(e))(a), n),
    nil: c => n => n,
    cons: e => l => c => n => c(e)(l(c)(n)),
    into: i => l => l(e => a => a.concat(i(e)))([]).reverse(),
}
