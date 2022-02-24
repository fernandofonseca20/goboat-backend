import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';
class HomeController {
  async show(req: Request, res: Response): Promise<Response> {
    try {

      return res.status(200).json({
        offers: [{
          title: "string",
          subTitle: "string",
          discount: 1,
          imageUrl: "string",
          backgroundColor: "string"
        }],
        highlights: [{
          imageUrl: "string",
          boatId: 1,
          title: "string",
        }],
        boatCategories: [{
          title: "string",
          id: "number"
        }],
        recommendedBoats: [{
          name: "string",
          city: "string",
          state: "string",
          pricePerDay: 1,
          stars: 1,
          id: 1
        }],
        islocator: false,
        isMariner: false
      });
    } catch (error) {
      console.log('HomeController show error', error);

      if (error instanceof EntityNotFoundError)
        return res.status(404).json({ message: 'HomeController not found', error });

      return res.status(500).json({ error });
    }
  }


}

export default new HomeController();
