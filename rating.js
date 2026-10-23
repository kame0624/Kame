// maimai のレーティング計算(maimai.html と admin.html で共通)
// 1曲のレーティング = floor( 定数 × min(達成率,100.5)/100 × 係数 )
(function () {
  var TABLE = [ // [達成率の下限, 係数, ランク]
    [100.5, 22.4, "SSS+"], [100, 21.6, "SSS"], [99.5, 21.1, "SS+"], [99, 20.8, "SS"],
    [98, 20.3, "S+"], [97, 20.0, "S"], [94, 16.8, "AAA"], [90, 15.2, "AA"],
    [80, 13.6, "A"], [75, 12.0, "BBB"], [70, 11.2, "BB"], [60, 9.6, "B"],
    [50, 8.0, "C"], [40, 6.4, "D"], [30, 4.8, "D"], [20, 3.2, "D"], [10, 1.6, "D"], [0, 0, "D"]
  ];
  function row(ach) {
    for (var i = 0; i < TABLE.length; i++) if (ach >= TABLE[i][0]) return TABLE[i];
    return TABLE[TABLE.length - 1];
  }
  window.maimaiRating = {
    calc: function (constant, ach) {
      constant = +constant; ach = +ach;
      if (!(constant > 0) || !(ach >= 0)) return 0;
      return Math.floor(constant * Math.min(ach, 100.5) / 100 * row(ach)[1] + 1e-9);
    },
    rank: function (ach) { return row(+ach)[2]; }
  };
})();
