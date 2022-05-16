import { inverse, Matrix } from "ml-matrix";
import { SVD } from 'svd-js';

import userModel from "../models/user.js";
import ConvertService from "./convert-service.js";

export default class RelevanceByRatingService{
    static async createMatrix(cityId, userId){
        const result = await userModel.findUsersAndRatingByCityIdByUserId(cityId, userId);
        let { vectorUser1, vectorUser2, matrix} = ConvertService.convertDataDbObjToMatrix(result);
        const index = vectorUser1.indexOf(userId);
        console.log(index);
        [matrix[0], matrix[index]] = [matrix[index], matrix[0]];
        matrix = matrix.slice(0, vectorUser2.length);
        let recommend = this.createRecommend(matrix, 0, 100);
        console.log(recommend);

        vectorUser2.forEach(el => {
            let rec = null;
            for (let i = 0; i < recommend.length; i++){
                if (recommend[i][0] === el) {
                    rec = recommend[i][1];
                    break;
                }
            }
            if (rec) userModel.pushEstimatedRecommendByCityIdByUserId(cityId, userId, el, rec);
        })

    }
    static createRecommend(arr, userId, N=30) {
        let n = 0;
        let m = arr?.length;
        if (arr?.length > arr[0]?.length){
            arr.map(el => el.slice(0, m));
        }
        n = m;
        const unratedItems = arr[userId].map((el, index) => !el ? index : null).filter(el => el !== null);
        if (!unratedItems.length) console.log("unratedItems is empty...");
        const itemScores = {};
        unratedItems.forEach(el => {
            let estimatedScore = this.svdEast(arr, userId, el, n);
            itemScores[el] = estimatedScore;
        });
        const result = Object.entries(itemScores).sort((a, b) => b[1] - a[1]).slice(0, N);
        return result;
    }

    static svdEast(arr, userId, itemId, n, percentage = 0.9){
        let simTotal = 0.0, ratSimTotal = 0.0;
        let { u, q: sigma } = SVD(arr);
        let k = this.sigmaPct(sigma, percentage);
        sigma = sigma.slice(0, k);
        let sigmaK = [];
        for(let i = 0; i < k; i++) {
            sigmaK.push(new Array(k).fill(0));
            sigmaK[i][i] = sigma[i];
        }
        u = u.map((el) => el.slice(0, k));
        const matrix = new Matrix(arr);
        const xformedItems = matrix.transpose().mmul(new Matrix(u)).mmul(inverse(new Matrix(sigmaK)));
        const columnsSize = xformedItems.columns;
        let vectorItem = [];
        for (let j = 0; j < columnsSize; j++)
            vectorItem.push(xformedItems.get(itemId, j));
        for (let j = 0; j < n; j++) {
            let userRating = matrix.get(userId, j);
            if (!userRating || j === itemId) continue;
            let vectorItemJ = [];
            for (let k = 0; k < columnsSize; k++)
                vectorItemJ.push(xformedItems.get(j, k));    
            let similarity = this.cosin(Matrix.rowVector(vectorItem), Matrix.columnVector(vectorItemJ));
            simTotal += similarity;
            ratSimTotal += similarity * userRating;
        }

        if (!simTotal) return 0;
        return ratSimTotal / simTotal;

    }

    static sigmaPct(sigma, percentage){
        let sum1 = 0, sum2 = 0, k = 0;
        for (let i = 0; i < sigma.length; i++)
                sum1 += sigma[i] ** 2;
        for (let i = 0; i < sigma.length; i++){
                sum2 += sigma[i] ** 2;
                k++;
                if (sum1 * percentage <= sum2) return k;
            }
        return k;
    }

    static cosin(A, B){
        const num = A.mmul(B);
        const denom  = A.norm() * B.norm();
        return 0.5 + 0.5 * (num.get(0, 0) / denom);
    }
    static ecludSim(A, B){
        return 1.0 / (1.0 + A.sub(B).norm());
    }
}
