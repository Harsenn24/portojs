const encrypt_word = function e(n, e = 0, i = !1) { var t = "0123456789/abcdefghijklmnopqrstuvwxyz".split(""); 1 == i && (t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/".split("")); for (var l = t.slice(t.length - e, t.length), r = t.slice(0, t.length - e), c = l.concat(r), f = [], h = 0; h < n.length; h++) { var o = ""; o = void 0 === c[t.indexOf(n[h])] ? n[n.indexOf(n[h])] : c[t.indexOf(n[h])], f.push(o) } return f.join("") }
const decrypt_word = function d(n, e, i = !1) { var t = "0123456789/abcdefghijklmnopqrstuvwxyz".split(""); 1 == i && (t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/".split("")); for (var l = t.slice(t.length - e, t.length), r = t.slice(0, t.length - e), c = l.concat(r), d = [], f = 0; f < n.length; f++) { var h = ""; h = void 0 === c[t.indexOf(n[f])] ? n[n.indexOf(n[f])] : t[c.indexOf(n[f])], d.push(h) } return d.join("") }

function encrypt_id(data){
    data.forEach(el => {
        el._id = encrypt_word((el._id).toString(), 12)
    })

    return data
}
module.exports = { encrypt_word, decrypt_word, encrypt_id }