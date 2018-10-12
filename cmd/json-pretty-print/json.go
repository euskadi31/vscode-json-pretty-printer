// Copyright 2018 Axel Etcheverry. All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"io"
	"strings"
)

// TabStyleType type
type TabStyleType string

// TabStyleType enums
const (
	TabStyleTypeTab   TabStyleType = "tab"
	TabStyleTypeSpace TabStyleType = "space"
)

// JSONPrettyPrinter struct
type JSONPrettyPrinter struct {
	style TabStyleType
	size  int
}

// NewJSONPrettyPrinter constructor
func NewJSONPrettyPrinter(style TabStyleType, size int) *JSONPrettyPrinter {
	return &JSONPrettyPrinter{
		style: style,
		size:  size,
	}
}

func (p *JSONPrettyPrinter) indent() string {
	indent := "\t"

	if p.style == TabStyleTypeSpace {
		indent = strings.Repeat(" ", p.size)
	}

	return indent
}

// Process formatter
func (p *JSONPrettyPrinter) Process(r io.Reader, w io.Writer) (err error) {
	var data interface{}

	encoder := json.NewEncoder(w)
	encoder.SetIndent("", p.indent())

	decoder := json.NewDecoder(r)
	for {
		if err := decoder.Decode(&data); err == io.EOF {
			break
		} else if err != nil {
			return err
		}

		err = encoder.Encode(data)
	}

	return nil
}
