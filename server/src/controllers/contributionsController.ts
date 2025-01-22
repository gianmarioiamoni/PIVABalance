import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Contributions } from '../models/Contributions';
import { IUser } from '../models/User';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

class ContributionsController {
  async getContributionsByYear(req: AuthenticatedRequest, res: Response) {
    try {
      const { year } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      let contributions = await Contributions.findOne({
        userId: new Types.ObjectId(userId),
        year: parseInt(year)
      });

      if (!contributions) {
        // Create a new contributions record with default values
        contributions = await Contributions.create({
          userId: new Types.ObjectId(userId),
          year: parseInt(year),
          previousYearContributions: 0
        });
      }

      res.json(contributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async saveContributions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { year, previousYearContributions } = req.body;

      // Use findOneAndUpdate with upsert to create if not exists
      const contributions = await Contributions.findOneAndUpdate(
        { 
          userId: new Types.ObjectId(userId),
          year: parseInt(year)
        },
        { 
          $set: { 
            previousYearContributions: parseFloat(previousYearContributions) 
          }
        },
        { 
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      res.json(contributions);
    } catch (error) {
      console.error('Error saving contributions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateContributions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { year } = req.params;
      const { previousYearContributions } = req.body;

      const contributions = await Contributions.findOneAndUpdate(
        { 
          userId: new Types.ObjectId(userId),
          year: parseInt(year)
        },
        { 
          $set: { 
            previousYearContributions: parseFloat(previousYearContributions) 
          }
        },
        { 
          new: true,
          runValidators: true
        }
      );

      if (!contributions) {
        return res.status(404).json({ message: 'Contributions not found' });
      }

      res.json(contributions);
    } catch (error) {
      console.error('Error updating contributions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const contributionsController = new ContributionsController();
