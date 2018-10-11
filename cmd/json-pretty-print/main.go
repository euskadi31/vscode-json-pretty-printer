package main

import (
	"encoding/json"
	"flag"
	"io"
	"log"
	"os"
	"strings"
)

var indentType string
var indentSize int

func init() {
	flag.StringVar(&indentType, "indent-type", "tab", "tab or space")
	flag.IntVar(&indentSize, "indent-size", 4, "size of indentation")
}

func main() {
	var data interface{}

	indent := "\t"

	if indentType == "space" {
		indent = strings.Repeat(" ", indentSize)
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", indent)

	decoder := json.NewDecoder(os.Stdin)
	for {
		if err := decoder.Decode(&data); err == io.EOF {
			return
		} else if err != nil {
			log.Panic(err)
		}

		if err := encoder.Encode(data); err != nil {
			log.Panic(err)
		}
	}
}
