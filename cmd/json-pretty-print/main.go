// Copyright 2018 Axel Etcheverry. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"log"
	"os"
)

var indentType string
var indentSize int

func init() {
	flag.StringVar(&indentType, "indent-type", "tab", "tab or space")
	flag.IntVar(&indentSize, "indent-size", 4, "size of indentation")
}

func main() {
	formatter := NewJSONPrettyPrinter(TabStyleType(indentType), indentSize)

	if err := formatter.Process(os.Stdin, os.Stdout); err != nil {
		log.Panic(err)
	}
}
