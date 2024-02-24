"use client";

import { useState } from "react";
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
    TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as toxicityClassifier from "@tensorflow-models/toxicity";

export default function Home() {
    const [text, setText] = useState(""); // State for the input text
    const [data, setData] = useState([]); // State for the table data
    const [loading, setLoading] = useState(false); // State for tracking loading

    // Handles input change events
    const handleChange = (event) => {
        setText(event.target.value);
    };

    // Classifies the text for toxicity
    const classify = async () => {
        setLoading(true);
        const start = Date.now();
        const model = await toxicityClassifier.load(0.7);
        const predictions = await model.classify([text]);
        // Processes and formats the predictions
        const processedData = processPredictions(predictions, text, start);
        setData((prevData) => [...prevData, processedData]);
        setText("");
        setLoading(false);
    };

    // Processes predictions to format for the table
    const processPredictions = (predictions, text, start) => {
        const formattedPredictions = formatPredictions(predictions);
        const totalTime = `${Date.now() - start}ms`;
        return { ...formattedPredictions, text, time: totalTime };
    };

    // Formats predictions for display
    const formatPredictions = (predictions) => {
        return predictions.reduce((acc, prediction) => {
            acc[prediction.label] = formatProbability(
                prediction.results[0].probabilities[1]
            );
            return acc;
        }, {});
    };

    // Formats probability and adds symbol
    const formatProbability = (probability) => {
        const value = (probability * 100).toFixed(2);
        const symbol = value >= 50 ? "✔️" : "❌";
        return `${value}% ${symbol}`;
    };
    const header = [
        "Text",
        "Toxicity",
        "Obscene",
        "Threat",
        "Insult",
        "Sexual_Explicit",
        "Severe_Toxicity",
        "Time",
    ];
    // Renders the table
    const renderTable = () => (
        <Table className="border border-black px-5">
            <TableCaption>Toxicity Classifier</TableCaption>
            <TableHeader>
                {header.map((item, index) => (
                    <TableHead
                        key={index}
                        className="border border-black text-center"
                    >
                        {item}
                    </TableHead>
                ))}
            </TableHeader>
            <TableBody>
                {data.map((row, index) => (
                    <TableRow key={index}>
                        {header.map((item, index) => (
                            <TableCell
                                key={index}
                                className="border border-black text-center"
                            >
                                {row[item.toLowerCase()]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <>
            <div className="max-w-lg mx-auto my-8 border border-gray-200 rounded-lg p-4 shadow-lg">
                <p className="mb-4 text-lg font-semibold">
                    Enter text below and click Classify to add it to the table.
                </p>
                <blockquote className="mt-6 border-l-2 pl-6 italic">
                    Threshold is set to 0.7
                </blockquote>
                <div className="flex flex-col space-y-4 mt-3">
                    <Input
                        placeholder="Enter your text here"
                        onChange={handleChange}
                        className="border border-gray-200 mt-1"
                    />
                    <Button
                        className="bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
                        disabled={loading}
                        onClick={classify}
                    >
                        Classify
                    </Button>
                </div>
            </div>
            {loading && (
                <>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="animate-ping rounded-full border border-gray-200 w-14 h-14 flex items-center justify-center" />
                        <div className="text-sm font-medium">Thinking</div>
                    </div>
                </>
            )}
            {data.length > 0 && renderTable()}
        </>
    );
}
