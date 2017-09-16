export class DEM {
  _area: string = "DEM Area";
  get area(): string {
    return this._area;
  }
  set area(area: string) {
    this._area = area;
  }

  _data: Uint16Array;
  get data(): Uint16Array {
    return this._data;
  }
  set data(data: Uint16Array) {
    this._data = data;
  }
}