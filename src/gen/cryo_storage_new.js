/*
  API Draft

  This file is an API draft with some ideas I
  had for map generation.

  Some of the ideas are borrowed from UI design.

  The API will be solely function-based (I don't
  dare to say functional).
*/

module.exports = function (sheet) {
  // Create a sheet if none is passed
  if (sheet === undefined) {
    sheet = new Gen.Sheet(Gen.between(20, 30),
                          Gen.between(20, 30));
  }

  // A rectangle of 1x1
  var columnPoly = new Gen.Rect(new Vec2(1, 1));
  // Generate at max 10 positions inside
  // the sheet, with minimum distance from
  // the borders of 1.
  var positions = Gen.positions(sheet, 10, 1);

  // Cut the pillars
  // this returns smaller sheets
  var csheets = sheet.cut(positions, columnPoly);

  // Draw pillars in the cut sheets
  for (var s in csheets) {
    csheets[s].draw(new Objects.ConcretePillar(),
                    new Vec2());
  }

  // Cut the rest of the original sheet in
  // rectangular sheets
  var rects = sheet.cutRect();

  for (var r in rects) {
    rects[r].slice();
  }
}
