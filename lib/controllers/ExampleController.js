const things = [{ id: 1, data: 'thing 1' }, { id: 2, data: 'thing 2' }];

class ExampleController {
  static getAll(req, res) {
    return res.status(200).json({
      things,
      message: 'All the things',
    });
  }

  static getSingleThing(req, res) {
    const findThing = things.find(thing => thing.id === parseInt(req.params.id, 10));
    if (findThing) {
      return res.status(200).json({
        thing: findThing,
        message: 'A single thing record',
      });
    }
    return res.status(404).json({
      message: 'Thing record not found',
    });
  }
}

export default ExampleController;
