export default function (name) {
  const q = window.location.search.match(new RegExp(`[?&]${name}=([^&#]*)`))

  return q && q[1]
}
