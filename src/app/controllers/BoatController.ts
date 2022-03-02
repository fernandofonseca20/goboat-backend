import { Request, Response } from 'express';
import * as Yup from 'yup';
import { BoatValidator } from '@validators';

import {
  BoatCategoryRepository,
  BoatRepository,
  BoatLicenseRepository,
  BoatAttributesDefatult
} from '@repositories';

import { IBoatFilter } from '@interfaces';

class BoatController {

  async store(req: Request, res: Response) {
    try {
      const { user, ...reqBody } = req.body;
      const boatBody = await BoatValidator.store(reqBody);

      const { license, boatCategory } = boatBody;

      const existCategory = await BoatCategoryRepository.getById(boatCategory);

      if (!existCategory) {
        return res.status(401).json({ message: 'Not exist Boat Category' })
      }
      const existLicense = await BoatLicenseRepository.getById(license);

      if (!existLicense) {
        return res.status(401).json({ message: 'Not exist Boat License' })
      }

      const boat = await BoatRepository.store(boatBody, user.lessee.id);

      return res.status(200).json(boat);
    } catch (error) {
      console.log('BoatController store error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          message: 'validationError',
          errors: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { page, itemsPerPage } = req.query;

      const boatFilter = await BoatValidator.search(req.body);

      const boatResult = await BoatRepository.search(boatFilter, +page, +itemsPerPage );

      return res.status(200).json(boatResult);
    } catch (error) {
      console.log('BoatController search error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          message: 'validationError',
          errors: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }

  async attributesDefault(req: Request, res: Response) {
    try {
      const boatAttributesDefaults = await BoatAttributesDefatult.listActives();

      return res.status(200).json(boatAttributesDefaults);
    } catch (error) {
      console.log('BoatController store error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          errors: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }
  async listLicenseActveds(req: Request, res: Response) {
    try {
      const licenses = await BoatLicenseRepository.listActives();

      return res.status(200).json(licenses);
    } catch (error) {
      console.log('BoatController store error', error);

      if (error instanceof Yup.ValidationError)
        return res.status(400).json({
          errors: error.errors,
        });

      return res.status(500).json({ message: error.message, error });
    }
  }

}

export default new BoatController();