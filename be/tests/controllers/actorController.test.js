const ActorController = require("../../controllers/ActorController");
const Actor = require("../../models/Actor");

jest.mock("../../models/Actor", () => ({
  create: jest.fn(),
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe("ActorController CRUD Operations", () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an actor successfully", async () => {
    const req = {
      body: {
        name: "Test Actor",
        birthdate: "1990-01-01",
        countryId: 1,
        image: "http://example.com/image.jpg",
      },
    };

    const mockCreatedActor = { id: 1, ...req.body };
    Actor.create.mockResolvedValue(mockCreatedActor);

    await ActorController.create(req, res);

    console.log("Actor.create calls: ", Actor.create.mock.calls);

    expect(Actor.create).toHaveBeenCalledTimes(1);
    expect(Actor.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreatedActor);
  });

  it("should return validation error", async () => {
    const req = { body: { name: "Test Actor" } };

    const validationError = new Error("Validation Error");
    validationError.name = "SequelizeValidationError";
    validationError.errors = [
      { message: "Actor.birthdate cannot be null" },
      { message: "Actor.countryId cannot be null" },
    ];

    Actor.create.mockRejectedValue(validationError);

    await ActorController.create(req, res);

    expect(Actor.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Validation Error",
      details: ["Actor.birthdate cannot be null", "Actor.countryId cannot be null"],
    });
  });
  // Tambahkan pengujian lainnya seperti getAll, getById, update, dan delete...

  it("should get all actors successfully", async () => {
    const req = {
      query: {
        page: 1,
        limit: 10,
        search: "Test",
      },
    };
  
    const mockActors = {
      count: 1,
      rows: [{ id: 1, name: "Test Actor", image: "http://example.com/image.jpg" }],
    };
  
    Actor.findAndCountAll.mockResolvedValue(mockActors);
  
    await ActorController.getAll(req, res);
  
    // Debug log untuk memastikan fungsi dipanggil
    console.log("Actor.findAndCountAll calls: ", Actor.findAndCountAll.mock.calls);
  
    expect(Actor.findAndCountAll).toHaveBeenCalledTimes(1);
    expect(Actor.findAndCountAll).toHaveBeenCalledWith({
      where: { name: { [Symbol.for("sequelize.like")]: "%Test%" } },
      offset: 0,
      limit: 10,
      attributes: ["id", "name", "image"],
    });
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      actors: mockActors.rows,
      meta: {
        totalItems: mockActors.count,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
      },
    });
  });
  
  it("should get an actor by ID successfully", async () => {
    const req = { params: { id: 1 } };

    const mockActor = { id: 1, name: "Test Actor", birthdate: "1990-01-01" };
    Actor.findByPk.mockResolvedValue(mockActor);

    await ActorController.getById(req, res);

    expect(Actor.findByPk).toHaveBeenCalledTimes(1);
    expect(Actor.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockActor);
  });

  it("should return 404 if actor not found", async () => {
    const req = { params: { id: 999 } };

    Actor.findByPk.mockResolvedValue(null);

    await ActorController.getById(req, res);

    expect(Actor.findByPk).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Actor not found" });
  });

  it("should update an actor successfully", async () => {
    const req = {
      params: { id: 1 },
      body: { name: "Updated Actor" },
    };

    Actor.update.mockResolvedValue([1]);
    const mockUpdatedActor = { id: 1, name: "Updated Actor" };
    Actor.findByPk.mockResolvedValue(mockUpdatedActor);

    await ActorController.update(req, res);

    expect(Actor.update).toHaveBeenCalledTimes(1);
    expect(Actor.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedActor);
  });

  it("should return 404 if actor to update is not found", async () => {
    const req = {
      params: { id: 999 },
      body: { name: "Updated Actor" },
    };

    Actor.update.mockResolvedValue([0]);

    await ActorController.update(req, res);

    expect(Actor.update).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Actor not found" });
  });

  it("should delete an actor successfully", async () => {
    const req = { params: { id: 1 } };

    Actor.destroy.mockResolvedValue(1);

    await ActorController.delete(req, res);

    expect(Actor.destroy).toHaveBeenCalledTimes(1);
    expect(Actor.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return 404 if actor to delete is not found", async () => {
    const req = { params: { id: 999 } };

    Actor.destroy.mockResolvedValue(0);

    await ActorController.delete(req, res);

    expect(Actor.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Actor not found" });
  });
});